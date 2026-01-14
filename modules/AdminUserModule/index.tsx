"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Trash2, Coins, Eye, Settings } from "lucide-react";
import { StatCard } from "@/components/elements/Admin/StatCard";
import { getStatsConfig } from "./const";
import { AdminUserResponse, AdminUserStatsResponse } from "./interface";
import { getAllUsers, getUserStats, deleteUser } from "@/lib/api/AdminUserApi";
import { toast } from "sonner";
import { TokenAdjustmentDialog } from "./components/TokenAdjustmentDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import Link from "next/link";

const AdminUserModule = () => {
  const [stats, setStats] = useState<AdminUserStatsResponse>({
    totalUser: 0,
    activeUser: 0,
    totalAdmin: 0,
  });
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });

  const [selectedUserForToken, setSelectedUserForToken] =
    useState<AdminUserResponse | null>(null);
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);

  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<AdminUserResponse | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        getUserStats(),
        getAllUsers(page),
      ]);
      setStats(statsData);

      if (usersData.data) {
        setUsers(usersData.data);
        setPaginationMeta(usersData.meta);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Gagal memuat data user.");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

    try {
      await deleteUser(id);
      toast.success("User berhasil dihapus");
      fetchData(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus user");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationMeta.lastPage) {
      setPage(newPage);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 shadow-none">
            Admin
          </Badge>
        );
      case "USER":
        return (
          <Badge variant="outline" className="text-gray-600">
            User
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Kelola User
          </h1>
          <p className="text-muted-foreground">
            Pantau dan kelola semua pengguna aplikasi.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {getStatsConfig(
          stats.totalUser,
          stats.activeUser,
          stats.totalAdmin
        ).map((stat, index) => (
          <StatCard key={index} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {/* User Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Belum ada user.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-muted-foreground">
                        {(page - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.target || "-"}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold">
                          {user.tokenBalance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/user/${user.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                              title="Detail User"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                            title="Kelola Token"
                            onClick={() => {
                              setSelectedUserForToken(user);
                              setIsTokenDialogOpen(true);
                            }}
                          >
                            <Coins className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
                            title="Edit Profil"
                            onClick={() => {
                              setSelectedUserForEdit(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      page >= paginationMeta.lastPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <TokenAdjustmentDialog
        isOpen={isTokenDialogOpen}
        onOpenChange={setIsTokenDialogOpen}
        userId={selectedUserForToken?.id || null}
        userName={selectedUserForToken?.name}
        onSuccess={() => {
          fetchData(); // Refresh to show new token balance
          setSelectedUserForToken(null);
        }}
      />

      <EditUserDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={selectedUserForEdit}
        onSuccess={() => {
          fetchData(); // Refresh to show new data
          setSelectedUserForEdit(null);
        }}
      />
    </div>
  );
};

export default AdminUserModule;