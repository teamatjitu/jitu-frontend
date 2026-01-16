"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Loader2,
  Trophy,
  Users,
  Star,
  BarChart,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/elements/Admin/StatCard";
import {
  getLeaderboard,
  getTryoutStats,
  exportResults,
  LeaderboardEntry,
  TryoutStats,
} from "@/lib/api/AdminResultApi";
import { ScoreDistributionChart } from "./components/ScoreDistributionChart";
import { toast } from "sonner";

interface AdminTryoutResultModuleProps {
  tryoutId: string;
}

const AdminTryoutResultModule: React.FC<AdminTryoutResultModuleProps> = ({
  tryoutId,
}) => {
  const router = useRouter();
  const [stats, setStats] = useState<TryoutStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, lbData] = await Promise.all([
        getTryoutStats(tryoutId),
        getLeaderboard(tryoutId, 1, 10), // Ambil top 10 untuk overview
      ]);
      setStats(statsData);
      setLeaderboard(lbData.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data hasil tryout.");
    } finally {
      setIsLoading(false);
    }
  }, [tryoutId]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportResults(tryoutId);

      if (!data || data.length === 0) {
        toast.error("Tidak ada data untuk diekspor");
        return;
      }

      // Convert JSON to CSV string
      const headers = Object.keys(data[0]).join(",");
      const rows = data.map((row: any) =>
        Object.values(row)
          .map((value) => `"${value}"`) // Ensure values are quoted
          .join(",")
      );
      const csvContent = [headers, ...rows].join("\n"); // Use \n for newline in CSV string

      // Create Blob and Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Hasil_Tryout_${stats?.title.replace(/\s+/g, "_")}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data berhasil diekspor ke CSV");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengekspor data.");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats)
    return (
      <div className="p-8 text-center text-red-500">Data tidak ditemukan</div>
    );

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Hasil & Leaderboard
            </h1>
            <p className="text-muted-foreground">{stats.title}</p>
          </div>
        </div>
        <Button
          onClick={handleExport}
          disabled={isExporting}
          variant="outline"
          className="gap-2 font-semibold border-primary text-primary hover:bg-primary/5"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export ke CSV
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="TOTAL PESERTA"
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-100"
          value={stats.totalParticipants}
        />
        <StatCard
          label="RATA-RATA SKOR"
          icon={BarChart}
          color="text-purple-600"
          bgColor="bg-purple-100"
          value={Math.round(stats.averageScore)}
        />
        <StatCard
          label="SKOR TERTINGGI"
          icon={Trophy}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
          value={Math.round(stats.highestScore)}
        />
        <StatCard
          label="SKOR TERENDAH"
          icon={Star}
          color="text-white"
          bgColor="bg-red-100"
          value={Math.round(stats.lowestScore)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Distribution Chart */}
        <div className="lg:col-span-1">
          <ScoreDistributionChart distribution={stats.distribution} />
        </div>

        {/* Right: Leaderboard Table */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top 10 Peserta Terbaik</CardTitle>
                <CardDescription>
                  Peringkat berdasarkan skor tertinggi
                </CardDescription>
              </div>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[60px]">Rank</TableHead>
                      <TableHead>Nama Peserta</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead className="text-right">Skor Akhir</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry) => (
                      <TableRow key={entry.user.email}>
                        <TableCell className="font-bold text-center">
                          {entry.rank <= 3 ? (
                            <Badge
                              className={
                                entry.rank === 1
                                  ? "bg-yellow-500"
                                  : entry.rank === 2
                                  ? "bg-gray-400"
                                  : "bg-amber-600"
                              }
                            >
                              {entry.rank}
                            </Badge>
                          ) : (
                            entry.rank
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={entry.user.image} />
                              <AvatarFallback>
                                {entry.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {entry.user.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {entry.user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {entry.user.target || "-"}
                        </TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          {Math.round(entry.totalScore)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminTryoutResultModule;
