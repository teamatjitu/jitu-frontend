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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Check, X, Loader2 } from "lucide-react";
import { StatCard } from "@/components/elements/Admin/StatCard";
import { getPaymentStatsConfig } from "./const";
import { Payment, AdminPaymentStatsResponse } from "./interface";
import {
  getPayments,
  getPaymentStats,
  confirmPayment,
  rejectPayment,
} from "@/lib/api/AdminPaymentApi";
import { toast } from "sonner";

const AdminPaymentModule = () => {
  const [stats, setStats] = useState<AdminPaymentStatsResponse>({
    totalRevenue: 0,
    totalSuccess: 0,
    totalPending: 0,
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    page: 1,
    lastPage: 1,
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, paymentsData] = await Promise.all([
        getPaymentStats(),
        getPayments(page, 10, filterStatus, debouncedSearch),
      ]);
      setStats(statsData);

      if (paymentsData.data) {
        setPayments(paymentsData.data);
        setPaginationMeta(paymentsData.meta);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Gagal memuat data pembayaran.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, filterStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConfirm = async (id: string) => {
    if (
      !confirm(
        "Konfirmasi pembayaran ini? Token akan otomatis ditambahkan ke saldo user."
      )
    )
      return;

    setIsActionLoading(id);
    try {
      await confirmPayment(id);
      toast.success("Pembayaran berhasil dikonfirmasi!");
      fetchData(); // Refresh list and stats
    } catch (error: any) {
      toast.error(error.message || "Gagal mengonfirmasi pembayaran");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Tolak pembayaran ini?")) return;

    setIsActionLoading(id);
    try {
      await rejectPayment(id);
      toast.success("Pembayaran berhasil ditolak.");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Gagal menolak pembayaran");
    } finally {
      setIsActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 shadow-none">
            Berhasil
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 shadow-none">
            Pending
          </Badge>
        );
      case "DECLINED":
      case "CANCELLED":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-white border-red-200 shadow-none"
          >
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationMeta.lastPage) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Kelola Pembayaran
        </h1>
        <p className="text-muted-foreground">
          Konfirmasi pembayaran user dan pantau pendapatan aplikasi.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {getPaymentStatsConfig(
          stats.totalRevenue,
          stats.totalSuccess,
          stats.totalPending
        ).map((stat, index) => (
          <StatCard key={index} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Cari Transaksi</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama atau email user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="w-full md:w-[200px] space-y-2">
          <label className="text-sm font-medium">Filter Status</label>
          <Select
            value={filterStatus}
            onValueChange={(val) => {
              setFilterStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="PENDING">Menunggu (Pending)</SelectItem>
              <SelectItem value="CONFIRMED">Berhasil (Confirmed)</SelectItem>
              <SelectItem value="DECLINED">Dibatalkan (Declined)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payments Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Memuat data pembayaran...
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Tidak ada data transaksi yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        #{p.id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {p.user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {p.user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{p.tokenPackage.name}</span>
                          <span className="text-xs font-bold text-blue-600">
                            {p.tokenAmount} Token
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        Rp {p.amount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-xs">
                        {p.paymentMethod}
                      </TableCell>
                      <TableCell>{getStatusBadge(p.status)}</TableCell>
                      <TableCell className="text-right">
                        {p.status === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                              onClick={() => handleConfirm(p.id)}
                              disabled={isActionLoading === p.id}
                            >
                              {isActionLoading === p.id ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => handleReject(p.id)}
                              disabled={isActionLoading === p.id}
                            >
                              {isActionLoading === p.id ? (
                                <Loader2 className="animate-spin" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        )}
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
    </div>
  );
};

export default AdminPaymentModule;
