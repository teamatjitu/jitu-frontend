"use client";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Edit,
  Target,
  BarChart3,
  Filter,
  Calendar,
  Users,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { menuItems, scoreHistory, stats, subtests } from "./payload";
import { ScoreData, StatCard, Subtest, MenuItem } from "./interface";
import DailyStreak from "./components/DailyStreak";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Mock registered tryouts data
  const registeredTryouts = [
    {
      id: 2,
      title: "Try Out UTBK SNBT 3 2026",
      number: "3",
      badge: "SNBT",
      participants: 18048,
      progress: 2, // 2 out of 7 subtests completed
      totalSubtests: 7,
      endDate: "2026-01-31",
    },
  ];

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
        // max: maxScore,
      },
    },
  };

  const handleLogoutButton = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-200 rounded-2xl flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white/30 shadow-xl">
                  {session.user.name.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#1A7BFF] flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {session.user.name}
                </h2>
                <p className="text-blue-100 mb-3 text-sm sm:text-base">
                  {session.user.email}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-blue-400/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                    <Target className="w-3.5 h-3.5" />
                    Target: UTBK 2026
                  </span>
                  <span className="bg-blue-400/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Terakhir aktif: {session.session.updatedAt.toDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex lg:flex-col gap-5">
              <Button
                variant={"outline"}
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <Edit className="w-5 h-5" />
                Edit Profil
              </Button>
              <Button
                onClick={handleLogoutButton}
                variant={"outline"}
                className="bg-red-500/70 backdrop-blur-sm text-white border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Keluar Akun
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Grid & Daily Streak */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Stats Cards - 2 columns on xl screens */}
          <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-sm`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {stat.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  {stat.suffix && (
                    <div className={`text-sm font-semibold ${stat.color}`}>
                      {stat.suffix}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Daily Streak - 1 column on xl screens */}
          <div className="xl:col-span-1">
            <Card className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    🔥
                  </div>
                  Daily Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DailyStreak />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Registered Try Out Section */}
        {registeredTryouts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Try Out Terdaftar
                </h2>
                <p className="text-gray-600">
                  Try out yang sedang kamu kerjakan
                </p>
              </div>
              <Button
                onClick={() => router.push("/tryout")}
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Lihat Semua
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {registeredTryouts.map((tryout) => {
                const progressPercentage =
                  (tryout.progress / tryout.totalSubtests) * 100;
                const daysRemaining = Math.ceil(
                  (new Date(tryout.endDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <Card
                    key={tryout.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                    onClick={() => router.push(`/tryout/${tryout.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Left Section - Try Out Info */}
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-bold">
                                  {tryout.badge}
                                </Badge>
                                <span className="text-sm text-gray-500 font-medium">
                                  Try Out #{tryout.number}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {tryout.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span>
                                    {tryout.participants.toLocaleString()}{" "}
                                    peserta
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span>
                                    {daysRemaining > 0
                                      ? `${daysRemaining} hari lagi`
                                      : "Berakhir hari ini"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 font-medium">
                                Progress Pengerjaan
                              </span>
                              <span className="text-blue-600 font-bold">
                                {tryout.progress}/{tryout.totalSubtests} Subtes
                              </span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {progressPercentage === 100
                                ? "✓ Semua subtes selesai!"
                                : `${Math.round(progressPercentage)}% selesai`}
                            </p>
                          </div>
                        </div>

                        {/* Right Section - Action Button */}
                        <div className="w-full lg:w-auto">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/tryout/${tryout.id}`);
                            }}
                            className="w-full lg:w-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group-hover:scale-105"
                          >
                            <PlayCircle className="w-5 h-5" />
                            {progressPercentage === 100
                              ? "Lihat Pembahasan"
                              : "Lanjutkan"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Progress Chart Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Progress Snapshot
            </h2>
            <p className="text-gray-600">
              Lacak perkembangan skor UTBK kamu dari waktu ke waktu
            </p>
          </div>

          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-xl font-bold text-gray-900">
                Grafik Progress Skor
              </CardTitle>
              <Button
                variant={"outline"}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition-all border-gray-200 shadow-sm"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-semibold">Filter</span>
              </Button>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              {/* Subtest Filter Chips */}
              <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
                {subtests.map((subtest) => (
                  <Badge
                    key={subtest.id}
                    onClick={() => toggleSubtest(subtest.id)}
                    variant={
                      activeSubtests.includes(subtest.id)
                        ? "default"
                        : "outline"
                    }
                    className="font-semibold transition-all cursor-pointer hover:scale-105 shadow-sm"
                  >
                    {subtest.label}
                  </Badge>
                ))}
              </div>

              {/* Chart */}
              <div className="relative h-80 sm:h-96 mb-6">
                <Line data={chartData} options={chartOptions} />
              </div>

              {/* Score Summary */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Riwayat Skor
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {scoreHistory.map((score, index) => (
                    <Card
                      key={score.to}
                      className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300"
                    >
                      <div className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">
                        {score.to}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {score.total}
                      </div>
                      <div className="text-xs mt-1">
                        {index > 0 && (
                          <span
                            className={`font-bold ${
                              score.total > scoreHistory[index - 1].total
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {score.total > scoreHistory[index - 1].total
                              ? "↑ +"
                              : "↓ "}
                            {Math.abs(
                              score.total - scoreHistory[index - 1].total
                            )}
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default DashboardModule;
