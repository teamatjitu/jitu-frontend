"use client";
import { TrendingUp, Edit, Target, BarChart3, Filter } from "lucide-react";
import { useState } from "react";
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
import { ScoreData, StatCard, Subtest, MenuItem } from "@/types";
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
        // max: maxScore,
      },
    },
  };

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
                <div className="w-24 h-24 bg-blue-200 rounded-2xl flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white/30">
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
                  <span className="bg-blue-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Target: UTBK 2026
                  </span>
                  <span className="bg-blue-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Terakhir aktif: Hari ini
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant={"outline"}
              className="bg-blue-400 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-500 transition-all flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Edit Profil
            </Button>
          </div>
        </Card>

        {/* Daily Streak */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Daily Streak
            </h2>
            <p className="text-gray-500">Ayo tetap nyalakan streakmu!</p>
          </div>

          <DailyStreak />
        </section>

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
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white rounded-2xl shadow-sm p-8">
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

          <Card className="bg-white rounded-2xl shadow-sm p-8">
            <CardHeader className="flex justify-between items-center mb-4 p-0">
              <CardTitle className="text-lg font-semibold">
                Progress Snapshot
              </CardTitle>
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
                {subtests.map((subtest) => (
                  <Badge
                    key={subtest.id}
                    onClick={() => toggleSubtest(subtest.id)}
                    variant={
                      activeSubtests.includes(subtest.id)
                        ? "default"
                        : "outline"
                    }
                    className="font-semibold transition-all cursor-pointer"
                  >
                    {subtest.label}
                  </Badge>
                ))}
              </div>

              {/* Chart */}
              <div className="relative h-80">
                <Line data={chartData} options={chartOptions} />
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
      </div>
    </div>
  );
};

export default DashboardModule;
