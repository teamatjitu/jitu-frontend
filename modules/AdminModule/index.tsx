"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  BookOpen,
  CreditCard,
  TrendingUp,
  PlusCircle,
  Wallet,
  Package,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { StatCard } from "@/components/elements/Admin/StatCard";
import { getTryoutStats } from "@/lib/api/AdminTryoutApi";
import { Badge } from "@/components/ui/badge";
import { AdminOverviewCharts } from "./components/AdminOverviewCharts";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardStats {
  totalTryout: number;
  totalActiveTryout: number;
  totalUpcomingTryout: number;
  totalEndedTryout: number;
  totalUser: number;
  activeUser: number;
  totalAdmin: number;
  totalRevenue: number;
  totalPendingPayment: number;
  charts: {
    revenue: { label: string; value: number }[];
    userGrowth: { label: string; value: number }[];
    weeklyActivity: { label: string; value: number }[];
  };
}

const AdminModule = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getTryoutStats();
        setStats(data);
      } catch (error) {
        console.error(error);
        toast.error("Gagal memuat data statistik dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    {
      label: "Buat Tryout Baru",
      description: "Tambah sesi ujian UTBK baru",
      icon: PlusCircle,
      href: "/admin/create-to",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Kelola Pembayaran",
      description: `${stats?.totalPendingPayment || 0} Menunggu konfirmasi`,
      icon: CreditCard,
      href: "/admin/payments",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Atur Paket",
      description: "Update harga dan paket token",
      icon: Package,
      href: "/admin/packages",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Soal Harian",
      description: "Monitor tantangan hari ini",
      icon: Calendar,
      href: "/admin/daily",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">
            Mempersiapkan dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut ringkasan performa aplikasi JituPTN
          hari ini.
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL PENGGUNA"
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-100"
          value={stats?.totalUser || 0}
          suffix="Siswa Terdaftar"
        />
        <StatCard
          label="TOTAL TRYOUT"
          icon={BookOpen}
          color="text-indigo-600"
          bgColor="bg-indigo-100"
          value={stats?.totalTryout || 0}
          suffix={`${stats?.totalActiveTryout || 0} Sedang Aktif`}
        />
        <StatCard
          label="TOTAL PENDAPATAN"
          icon={Wallet}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
          value={stats?.totalRevenue || 0}
          suffix="Rupiah (Berhasil)"
        />
        <StatCard
          label="PENDING PAYMENTS"
          icon={TrendingUp}
          color="text-orange-600"
          bgColor="bg-orange-100"
          value={stats?.totalPendingPayment || 0}
          suffix="Perlu Konfirmasi"
        />
      </div>

      {/* Statistical Charts */}
      {stats?.charts && (
        <AdminOverviewCharts
          revenue={stats.charts.revenue}
          userGrowth={stats.charts.userGrowth}
          weeklyActivity={stats.charts.weeklyActivity}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Akses Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link href={action.href} key={index}>
                <Card className="hover:shadow-md transition-all duration-300 border-border/50 group cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center p-6 gap-4">
                      <div
                        className={`p-3 rounded-xl ${action.bgColor} ${action.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {action.label}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* System Summary / Tips */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 bg-primary text-primary-foreground shadow-lg h-full">
            <CardHeader>
              <CardTitle>Ringkasan Sistem</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Informasi status infrastruktur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                <span>Database Status</span>
                <Badge className="bg-emerald-500 hover:bg-emerald-500 border-none text-white">
                  Online
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                <span>Tryout Berjalan</span>
                <span className="font-bold">
                  {stats?.totalActiveTryout || 0} Sesi
                </span>
              </div>
              <div className="flex items-center justify-between text-sm border-b border-white/10 pb-2">
                <span>Admin Aktif</span>
                <span className="font-bold">{stats?.totalAdmin || 0} User</span>
              </div>
              <div className="pt-4">
                <p className="text-xs leading-relaxed opacity-80 italic">
                  &quot;Gunakan dashboard ini untuk memantau aktivitas user
                  secara real-time. Konfirmasi pembayaran tepat waktu akan
                  meningkatkan kepuasan siswa.&quot;
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminModule;
