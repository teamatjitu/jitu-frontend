"use client";
import {
  BookOpen,
  TrendingUp,
  Search,
  Menu,
  Bell,
  Edit,
  Target,
  BarChart3,
  MessageCircle,
  Settings,
  Eye,
  ChevronRight,
  LogOut,
  Sun,
  Info,
  Filter,
} from "lucide-react";
import { useState } from "react";
import { menuItems, scoreHistory, stats, subtests, weekDays } from "./payload";
import { ScoreData, Subtest, MenuItem, StatCard } from "./interface";
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
  const [activeSubtests, setActiveSubtests] = useState<string[]>(["total"]);

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
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-200 rounded-2xl flex items-center justify-center text-white text-3xl sm:text-4xl font-bold ring-4 ring-white/30 shadow-xl">
                  H
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#1A7BFF] flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Hakim Nizami
                </h2>
                <p className="text-blue-100 mb-3 text-sm sm:text-base">
                  hakimnizami15@gmail.com
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-blue-400/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                    <Target className="w-3.5 h-3.5" />
                    Target: UTBK 2026
                  </span>
                  <span className="bg-blue-400/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Terakhir aktif: Hari ini
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
            {stats.map((stat: StatCard, index) => (
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

        {/* Activity Chart */}
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Target Personal Best
                </h3>
                <p className="text-sm text-gray-600">
                  7 hari terakhir • Target:{" "}
                  <span className="text-emerald-600 font-semibold">500</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 font-medium">
                    Sedikit
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 font-medium">
                    Banyak
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 sm:gap-4 h-32">
              {weekDays.map((day, index) => {
                const isToday = index === 6;
                const height = Math.random() * 100;
                return (
                  <div
                    key={day}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-full bg-gray-100 rounded-t-xl overflow-hidden"
                      style={{ height: "100%" }}
                    >
                      <div
                        className={`w-full ${
                          isToday ? "bg-orange-500" : "bg-emerald-500"
                        } rounded-t-xl transition-all hover:opacity-80 cursor-pointer`}
                        style={{ height: `${height}%`, marginTop: "auto" }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isToday ? "text-orange-600" : "text-gray-600"
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-6 border-t border-gray-100 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  Terakhir aktif:{" "}
                  <span className="font-semibold text-gray-900">Belum ada</span>
                </span>
              </div>
              <Button
                variant="ghost"
                className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 flex items-center gap-1 p-0 h-auto"
              >
                Lihat Insight Lengkap
                <ChevronRight className="w-4 h-4" />
              </Button>
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
                Perkembangan skor dari TO 1 hingga TO 5
              </p>
            </div>
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
              {subtests.map((subtest: Subtest) => (
                <Badge
                  key={subtest.id}
                  onClick={() => toggleSubtest(subtest.id)}
                  variant={
                    activeSubtests.includes(subtest.id) ? "default" : "outline"
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
                            {item.description && (
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            )}
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

                {menu.action && (
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    {menu.action}
                  </Button>
                )}

                {index === menuItems.length - 1 && (
                  <Button
                    variant={"ghost"}
                    className="w-full mt-3 text-emerald-600 font-semibold text-sm hover:text-emerald-700 flex items-center justify-center gap-1 p-3 hover:bg-emerald-50 rounded-xl transition-all"
                  >
                    Pengaturan lengkap
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center pb-8">
          <Button
            variant={"destructive"}
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
