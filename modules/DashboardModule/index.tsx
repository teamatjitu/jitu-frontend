"use client";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Filter,
  Calendar,
  Users,
  Coins,
  ChevronRight,
  Info,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { subtests } from "./payload";
import { ScoreData, Subtest } from "./interface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserWithRole } from "@/lib/types";
import { 
  getUserStats, 
  getOngoingTryouts, 
  getAvailableTryouts, 
  getScoreHistory,
  UserStats,
  OngoingTryout,
  AvailableTryout,
  ScoreHistory
} from "@/lib/api/DashboardApi";
import { toast } from "sonner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardModule = () => {
  const router = useRouter();
  const [activeSubtests, setActiveSubtests] = useState<string[]>(["total"]);
  const { data: session, isPending } = useSession();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [ongoingTryouts, setOngoingTryouts] = useState<OngoingTryout[]>([]);
  const [availableTryoutsData, setAvailableTryoutsData] = useState<AvailableTryout[]>([]);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if ((session.user as unknown as UserWithRole).role === "ADMIN") {
        router.push("/admin");
      } else {
        loadDashboardData();
      }
    }
  }, [session, isPending, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [stats, ongoing, available, history] = await Promise.all([
        getUserStats(),
        getOngoingTryouts(),
        getAvailableTryouts(),
        getScoreHistory(),
      ]);

      setUserStats(stats);
      setOngoingTryouts(ongoing);
      setAvailableTryoutsData(available);
      setScoreHistory(history);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const toggleSubtest = (id: string) => {
    setActiveSubtests((prev) => {
      if (id === "total") {
        return ["total"];
      }
      const newSubtests = prev.filter((sub) => sub !== "total");
      if (newSubtests.includes(id)) {
        return newSubtests.filter((sub) => sub !== id);
      } else {
        return [...newSubtests, id];
      }
    });
  };

  const chartData = {
    labels: scoreHistory.map((score) => score.to),
    datasets: subtests
      .filter(
        (subtest) =>
          activeSubtests.includes(subtest.id) ||
          activeSubtests.includes("total")
      )
      .map((subtest) => {
        const color = subtest.color.replace("bg-", "").replace("-500", "");
        const colorMap: { [key: string]: string } = {
          blue: "#3B82F6",
          purple: "#A855F7",
          green: "#10B981",
          orange: "#F97316",
          red: "#EF4444",
          yellow: "#EAB308",
          indigo: "#6366F1",
        };
        return {
          label: subtest.label,
          data: scoreHistory.map(
            (score) => score[subtest.id as keyof ScoreData]
          ),
          borderColor: colorMap[color as keyof typeof colorMap] || "blue",
          backgroundColor:
            (colorMap[color as keyof typeof colorMap] || "blue") + "33",
          fill: true,
          tension: 0.4,
        };
      }),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen pl-20 bg-gray-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="pt-8 pb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Selamat datang kembali! Pantau progress belajar kamu di sini.
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-linear-to-br from-[#1A7BFF] to-[#0D5FD9] rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden border-0 hover:shadow-blue-500/30 transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-20 h-20 bg-blue-200 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/30 shadow-xl">
                  {session.user.name.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#1A7BFF] flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {session.user.name}
                </h2>
                <p className="text-blue-100 mb-3 text-sm sm:text-base">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="bg-blue-400/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/30 w-full sm:w-auto">
              <div className="text-3xl sm:text-4xl font-bold mb-1">
                {userStats?.tokenBalance ?? 0}
              </div>
              <div className="text-sm text-blue-100 mb-3">Kuota Premium</div>
              <Button
                variant="outline"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-6 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all w-full"
                onClick={() => router.push("/shop")}
              >
                <Coins className="w-4 h-4 mr-2" />
                Beli Kuota
              </Button>
            </div>
          </div>
        </Card>

        {/* Try Out Berlangsung Section */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              Try Out Berlangsung
              <span className="text-red-500">•</span>
            </h2>
            <p className="text-gray-600">
              Try Out yang sedang dalam periode pendaftaran
            </p>
          </div>

          {ongoingTryouts.length > 0 ? (
            ongoingTryouts.map((tryout) => (
              <Card
                key={tryout.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-6 p-6">
                    {/* Large Number Display */}
                    <div className="flex flex-col items-center">
                      <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-bold mb-2">
                        SNBT
                      </Badge>
                      <div className="text-7xl font-bold text-gray-900">
                        {tryout.title.match(/\d+/)?.[0] || "N/A"}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-32 w-px bg-gray-200"></div>

                    {/* Try Out Details */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">
                        {tryout.isPublic ? "Gratis" : "Berbayar"}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {tryout.title}
                      </h3>
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        {tryout.scheduledStart && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-500" />
                            <span>
                              {new Date(tryout.scheduledStart).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>
                            {tryout.participants.toLocaleString()} Peserta
                          </span>
                        </div>
                      </div>

                      {/* Not Registered State */}
                      {!tryout.isRegistered && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <Info className="w-5 h-5 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  Kamu belum mendaftar Try Out
                                </p>
                                <p className="text-sm text-gray-600">
                                  Beli kuota Try Out atau daftar Try Out gratis
                                  untuk mulai latihan!
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                onClick={() => router.push("/shop")}
                              >
                                Beli Kuota Premium
                              </Button>
                              <Button
                                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                                onClick={() =>
                                  router.push(`/tryout/${tryout.id}`)
                                }
                              >
                                Daftar Try Out
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Tidak ada try out yang sedang berlangsung</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Try Out Tersedia Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Try Out Tersedia
              </h2>
              <p className="text-gray-600">Try Out yang bisa kamu ikuti</p>
            </div>
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1"
              onClick={() => router.push("/tryout")}
            >
              Jelajahi Try Out Tersedia
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTryoutsData.slice(0, 6).map((tryout) => (
              <Card
                key={tryout.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer group"
                onClick={() => router.push(`/tryout/${tryout.id}`)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex flex-col items-center">
                      <Badge className="bg-green-500 text-white px-2.5 py-0.5 text-xs font-bold mb-2">
                        SNBT
                      </Badge>
                      <div className="text-5xl font-bold text-gray-900">
                        {tryout.title.match(/\d+/)?.[0] || "N/A"}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-xs text-gray-600 mb-1">
                        {tryout.isPublic ? "Gratis" : "Berbayar"}
                      </p>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {tryout.title}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {tryout.scheduledStart && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-700">
                          {new Date(tryout.scheduledStart).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {tryout.participants.toLocaleString()} Peserta
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardModule;
