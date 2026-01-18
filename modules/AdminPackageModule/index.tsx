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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2, Pencil, Plus, Search, Package, Check, X } from "lucide-react";
import { StatCard } from "@/components/elements/Admin/StatCard";
import {
  getPackages,
  togglePackageStatus,
  deletePackage,
  TokenPackage,
} from "@/lib/api/AdminPackageApi";
import { toast } from "sonner";
import { PackageDialog } from "./components/PackageDialog";

const AdminPackageModule = () => {
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPkg, setSelectedPkg] = useState<TokenPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPackages();
      setPackages(data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data paket.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStatus = async (id: string) => {
    try {
      await togglePackageStatus(id);
      toast.success("Status paket berhasil diubah");
      fetchData();
    } catch {
      toast.error("Gagal mengubah status paket");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus paket ini? Tindakan ini tidak bisa dibatalkan."))
      return;
    try {
      await deletePackage(id);
      toast.success("Paket berhasil dihapus");
      fetchData();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus paket";
      toast.error(errorMessage);
    }
  };

  const filteredPackages = packages.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Kelola Paket Jualan
          </h1>
          <p className="text-muted-foreground">
            Atur paket token yang akan tampil di halaman Toko user.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedPkg(null);
            setIsDialogOpen(true);
          }}
          className="font-semibold shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="TOTAL PAKET"
          icon={Package}
          color="text-blue-600"
          bgColor="bg-blue-100"
          value={packages.length}
          isLoading={isLoading}
        />
        <StatCard
          label="PAKET AKTIF"
          icon={Check}
          color="text-green-600"
          bgColor="bg-green-100"
          value={packages.filter((p) => p.isActive).length}
          isLoading={isLoading}
        />
        <StatCard
          label="PAKET NON-AKTIF"
          icon={X}
          color="text-white"
          bgColor="bg-red-100"
          value={packages.filter((p) => !p.isActive).length}
          isLoading={isLoading}
        />
      </div>

      {/* Filters */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama paket..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Paket Token</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nama Paket</TableHead>
                  <TableHead>Jumlah Token</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Terjual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Memuat...
                    </TableCell>
                  </TableRow>
                ) : filteredPackages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Belum ada paket.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPackages.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.tokenAmount} Token</TableCell>
                      <TableCell>
                        Rp {p.price.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {p._count?.payments || 0}
                          </span>
                          <span className="text-xs">kali</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={p.isActive}
                            onCheckedChange={() => handleToggleStatus(p.id)}
                          />
                          <Badge
                            variant={p.isActive ? "default" : "secondary"}
                            className={`h-6 text-[10px] uppercase font-bold ${
                              p.isActive
                                ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            {p.isActive ? "Aktif" : "Non-Aktif"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => {
                              setSelectedPkg(p);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(p.id)}
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
        </CardContent>
      </Card>

      <PackageDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        pkg={selectedPkg}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default AdminPackageModule;
