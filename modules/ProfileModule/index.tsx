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
import { ScoreData, Subtest, MenuItem, StatCard } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileModule = () => {
  const [selectedSubtests, setSelectedSubtests] = useState<string[]>(["total"]);

  const toggleSubtest = (id: string) => {
    setSelectedSubtests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getMaxScore = () => {
    let max = 0;
    scoreHistory.forEach((score) => {
      selectedSubtests.forEach((subtest) => {
        const value = score[subtest as keyof ScoreData] as number;
        if (value > max) max = value;
      });
    });
    return Math.ceil(max / 100) * 100;
  };

  const maxScore = getMaxScore();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-20 mt-24 p-8">
        {/* Profile Card */}
        <Card className="bg-linear-to-br from-[#1A7BFF] to-[#0D5FD9] rounded-3xl p-8 mb-8 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden border-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white/30">
                  H
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#1A7BFF] flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Hakim Nizami</h2>
                <p className="text-blue-100 mb-3">hakimnizami15@gmail.com</p>
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 backdrop-blur-xl px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Target: UTBK 2026
                  </span>
                  <span className="bg-white/20 backdrop-blur-xl px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Terakhir aktif: Hari ini
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant={"outline"}
              className="bg-white/20 backdrop-blur-xl border-2 border-white/50 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit Profil
            </Button>
          </div>
        </Card>

        {/* Progress Snapshot */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Progress Snapshot
            </h2>
            <p className="text-gray-500">
              Gambaran singkat performa terbaru kamu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {stats.map((stat: StatCard, index) => (
              <Card
                key={index}
                className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-xl hover:border-[#1A7BFF] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <BarChart3 className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-xs font-semibold text-gray-500 mb-2">
                  {stat.label}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-black text-gray-900">
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

          {/* Activity Chart */}
          <Card className="bg-white rounded-2xl shadow-sm p-8">
            <CardHeader className="flex items-center justify-between mb-6 p-0">
              <div>
                <CardTitle className="font-bold text-gray-900 mb-1">
                  Target Personal Best
                </CardTitle>
                <p className="text-sm text-gray-500">
                  7 hari terakhir • Target:{" "}
                  <span className="text-emerald-600 font-semibold">500</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Sedikit</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Banyak</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="flex items-end justify-between gap-4 h-32">
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
                          } rounded-t-xl transition-all hover:opacity-80`}
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

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Terakhir aktif:{" "}
                    <span className="font-semibold text-gray-900">
                      Belum ada
                    </span>
                  </span>
                </div>
                <button className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 flex items-center gap-1">
                  Lihat Insight Lengkap
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Score Statistics Chart */}
          <Card className="bg-white rounded-2xl shadow-sm p-8">
            <CardHeader className="flex items-center justify-between mb-6 p-0">
              <div>
                <CardTitle className="font-bold text-gray-900 mb-1">
                  Statistik Skor Try Out
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Perkembangan skor dari TO 1 hingga TO 5
                </p>
              </div>
              <Button
                variant={"outline"}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-all"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-semibold">Filter</span>
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {/* Subtest Filter Chips */}
              <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-100">
                {subtests.map((subtest: Subtest) => (
                  <Button
                    key={subtest.id}
                    onClick={() => toggleSubtest(subtest.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedSubtests.includes(subtest.id)
                        ? `${subtest.color} text-white shadow-lg`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {subtest.label}
                  </Button>
                ))}
              </div>

              {/* Chart */}
              <div className="relative h-80">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 font-semibold">
                  {[
                    maxScore,
                    maxScore * 0.75,
                    maxScore * 0.5,
                    maxScore * 0.25,
                    0,
                  ].map((value) => (
                    <div key={value}>{Math.round(value)}</div>
                  ))}
                </div>

                {/* Grid lines */}
                <div className="absolute left-12 right-0 top-0 bottom-8 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-gray-200"></div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="absolute left-12 right-0 top-0 bottom-8">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    {selectedSubtests.map((subtestId) => {
                      const subtest = subtests.find((s) => s.id === subtestId);
                      if (!subtest) return null;

                      const points = scoreHistory
                        .map((score, index) => {
                          const x = (index / (scoreHistory.length - 1)) * 100;
                          const value = score[
                            subtestId as keyof ScoreData
                          ] as number;
                          const y = 100 - (value / maxScore) * 100;
                          return `${x},${y}`;
                        })
                        .join(" ");

                      const color = subtest.color
                        .replace("bg-", "")
                        .replace("-500", "");
                      const colorMap: { [key: string]: string } = {
                        blue: "#3B82F6",
                        purple: "#A855F7",
                        green: "#10B981",
                        orange: "#F97316",
                        red: "#EF4444",
                        yellow: "#EAB308",
                        indigo: "#6366F1",
                      };

                      return (
                        <g key={subtestId}>
                          <polyline
                            points={points}
                            fill="none"
                            stroke={colorMap[color]}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                          />
                          {scoreHistory.map((score, index) => {
                            const x = (index / (scoreHistory.length - 1)) * 100;
                            const value = score[
                              subtestId as keyof ScoreData
                            ] as number;
                            const y = 100 - (value / maxScore) * 100;
                            return (
                              <circle
                                key={index}
                                cx={`${x}%`}
                                cy={`${y}%`}
                                r="4"
                                fill={colorMap[color]}
                                className="hover:r-6 transition-all cursor-pointer"
                              />
                            );
                          })}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="absolute left-12 right-0 bottom-0 flex justify-between text-xs text-gray-600 font-semibold">
                  {scoreHistory.map((score) => (
                    <div key={score.to} className="text-center">
                      {score.to}
                    </div>
                  ))}
                </div>
              </div>

              {/* Score Summary */}
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {scoreHistory.map((score, index) => (
                  <Card
                    key={score.to}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all"
                  >
                    <div className="text-xs text-gray-500 font-semibold mb-1">
                      {score.to}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {score.total}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {index > 0 && (
                        <span
                          className={
                            score.total > scoreHistory[index - 1].total
                              ? "text-emerald-600"
                              : "text-red-600"
                          }
                        >
                          {score.total > scoreHistory[index - 1].total
                            ? "↑"
                            : "↓"}
                          {Math.abs(
                            score.total - scoreHistory[index - 1].total
                          )}
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {menuItems.map((menu: MenuItem, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-sm p-8">
              <CardHeader className="flex items-center gap-4 mb-6 p-0">
                <div
                  className={`w-14 h-14 ${menu.bgColor} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <menu.icon className={`w-7 h-7 ${menu.color}`} />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-bold text-gray-900 mb-1">
                    {menu.label}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{menu.description}</p>
                </div>
              </CardHeader>

              <CardContent className="p-0">
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
                            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-all"></div>
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
                  <Button className="w-full bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl flex items-center justify-center gap-2">
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
        <div className="mt-8 flex justify-center">
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

export default ProfileModule;
