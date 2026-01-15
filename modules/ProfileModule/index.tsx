// modules/ProfileModule/index.tsx
"use client";
import {
  BookOpen,
  TrendingUp,
  Target,
  BarChart3,
  MessageCircle,
  Edit,
  ChevronRight,
  LogOut,
  Award,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client"; // Gunakan auth client
import { menuItems, subtests, weekDays } from "./payload";
import { ScoreData, MenuItem, StatCard } from "./interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [activeSubtests, setActiveSubtests] = useState<string[]>(["total"]);
  
  // State untuk data dinamis
  const [profileData, setProfileData] = useState<any>(null);

  // Fetch Data dari Backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/api/profile/stats`, {
            // Include credentials jika backend butuh cookie session, 
            // tapi better-auth client biasanya handle ini via header/cookie otomatis jika satu domain
        });
        
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile stats", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchProfileData();
    }
  }, [session]);

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

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  // Gunakan data dari backend atau fallback ke array kosong
  const scoreHistory: ScoreData[] = profileData?.scoreHistory || [];

  const chartData = {
    labels: scoreHistory.map((score) => score.to),
    datasets: subtests
      .filter(
        (subtest) =>
          activeSubtests.includes(subtest.id) || activeSubtests.includes("total")
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
      legend: { position: "bottom" as const },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // Helper untuk stats card dinamis
  const getDynamicStats = (): StatCard[] => {
    const s = profileData?.stats;
    return [
      {
        label: "SKOR TERAKHIR",
        value: s?.lastScore || 0,
        icon: BarChart3,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        label: "PERSONAL BEST",
        value: s?.personalBest || 0,
        icon: Award,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
      {
        label: "AKTIVITAS MINGGUAN",
        value: s?.weeklyActivity || 0,
        icon: Calendar,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        suffix: "soal",
      },
      {
        label: "TOTAL TRYOUT",
        value: s?.totalTryouts || 0,
        icon: CheckCircle2,
        color: "text-pink-600",
        bgColor: "bg-pink-100",
        suffix: "selesai",
      },
    ];
  };

  if (loading && !profileData) {
      return (
        <div className="min-h-screen pl-20 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen pl-20 bg-gray-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="pt-8 pb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profil Saya</h1>
          <p className="text-gray-600">
            Kelola informasi dan pengaturan akun kamu
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-[#1A7BFF] to-[#0D5FD9] rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden border-0 hover:shadow-blue-500/30 transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
              <div className="relative flex-shrink-0">
                {session?.user?.image ? (
                   <img src={session.user.image} alt={session.user.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ring-4 ring-white/30 shadow-xl object-cover" />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-200 rounded-2xl flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white/30 shadow-xl">
                    {session?.user?.name?.charAt(0) || "U"}
                  </div>
                )}
                
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#1A7BFF] flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {session?.user?.name || "User"}
                </h2>
                <p className="text-blue-100 mb-3 text-sm sm:text-base">
                  {session?.user?.email || "email@example.com"}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-blue-400/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                    <Target className="w-3.5 h-3.5" />
                    Target: {profileData?.basicInfo?.target || "UTBK 2026"}
                  </span>
                  <span className="bg-blue-400/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {profileData?.basicInfo?.lastActive || "Online"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant={"outline"}
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <Edit className="w-5 h-5" />
              Edit Profil
            </Button>
          </div>
        </Card>

        {/* Progress Snapshot */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Progress Snapshot
            </h2>
            <p className="text-gray-600">
              Gambaran singkat performa terbaru kamu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {getDynamicStats().map((stat: StatCard, index) => (
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
        </section>

        {/* Activity Chart (Mock Visual) */}
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <CardContent className="p-6">
             {/* ... Bagian Heatmap Activity (Bisa dibiarkan mock atau di-update logicnya nanti) ... */}
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Aktivitas Harian
                </h3>
                <p className="text-sm text-gray-600">
                  Konsistensi belajar kamu dalam seminggu terakhir
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 sm:gap-4 h-32">
              {weekDays.map((day, index) => {
                const isToday = index === 6;
                // Mock visual, nanti bisa di-link ke API jika backend sudah support daily aggregation per day
                const height = Math.random() * 80 + 20; 
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-100 rounded-t-xl overflow-hidden" style={{ height: "100%" }}>
                      <div
                        className={`w-full ${isToday ? "bg-orange-500" : "bg-emerald-500"} rounded-t-xl transition-all hover:opacity-80`}
                        style={{ height: `${height}%`, marginTop: "auto" }}
                      ></div>
                    </div>
                    <span className={`text-xs font-semibold ${isToday ? "text-orange-600" : "text-gray-600"}`}>
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Score Statistics Chart */}
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50 p-6">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                Statistik Skor Try Out
              </CardTitle>
              <p className="text-sm text-gray-600">
                Riwayat performa tryout kamu
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
             {/* Jika belum ada data skor */}
             {scoreHistory.length === 0 ? (
                 <div className="text-center py-12 text-gray-500">
                     Belum ada riwayat Tryout. Ayo kerjakan Tryout pertamamu!
                     <div className="mt-4">
                        <Button onClick={() => router.push('/tryout')}>Cari Tryout</Button>
                     </div>
                 </div>
             ) : (
                <>
                    {/* Subtest Filter Chips */}
                    <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
                    {subtests.map((subtest) => (
                        <Badge
                        key={subtest.id}
                        onClick={() => toggleSubtest(subtest.id)}
                        variant={activeSubtests.includes(subtest.id) ? "default" : "outline"}
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
                </>
             )}
          </CardContent>
        </Card>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {menuItems.map((menu: MenuItem, index) => (
            <Card
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 ${menu.bgColor} rounded-2xl flex items-center justify-center shadow-sm`}
                  >
                    <menu.icon className={`w-7 h-7 ${menu.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                      {menu.label}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{menu.description}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                {menu.items && (
                  <div className="space-y-3">
                    {menu.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {item.label}
                            </div>
                          </div>
                        </div>
                        {item.toggle && (
                          <div className="w-11 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all shadow-sm"></div>
                          </div>
                        )}
                        {item.link && (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center pb-8">
          <Button
            variant={"destructive"}
            onClick={handleLogout}
            className="bg-white border-2 border-red-200 text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardModule;