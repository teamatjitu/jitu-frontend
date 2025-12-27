"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle2,
  Target,
  Award,
  BarChart3,
  Eye,
  Download,
  Filter,
} from "lucide-react";
import { tryoutHistory } from "./payload";
import { TryoutHistory } from "./interface";

const HistoryModule = () => {
  const [filter, setFilter] = useState<"all" | "Saintek" | "Soshum">("all");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");

  const filteredHistory = tryoutHistory
    .filter((item) => filter === "all" || item.category === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.score - a.score;
    });

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-emerald-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "bg-emerald-50 border-emerald-200";
    if (percentage >= 60) return "bg-blue-50 border-blue-200";
    if (percentage >= 40) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateAverage = () => {
    if (filteredHistory.length === 0) return 0;
    const total = filteredHistory.reduce((sum, item) => sum + item.score, 0);
    return Math.round(total / filteredHistory.length);
  };

  const getHighestScore = () => {
    if (filteredHistory.length === 0) return 0;
    return Math.max(...filteredHistory.map((item) => item.score));
  };

  const getTotalAttempts = () => {
    return filteredHistory.length;
  };

  return (
    <div className="min-h-screen pl-20 bg-gray-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="pt-8 pb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Riwayat Try Out
          </h1>
          <p className="text-gray-600">
            Lihat semua hasil try out yang pernah kamu kerjakan
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Total Percobaan
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                {getTotalAttempts()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shadow-sm">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Skor Tertinggi
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                {getHighestScore()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Rata-rata Skor
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                {calculateAverage()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Kategori:
                </span>
                <Button onClick={() => setFilter("all")} className="rounded-lg">
                  Semua
                </Button>
                <Button
                  onClick={() => setFilter("Saintek")}
                  className="rounded-lg"
                >
                  Saintek
                </Button>
                <Button
                  onClick={() => setFilter("Soshum")}
                  className="rounded-lg"
                >
                  Soshum
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  Urutkan:
                </span>
                <Button
                  onClick={() => setSortBy("date")}
                  className="rounded-lg"
                >
                  Tanggal
                </Button>
                <Button
                  onClick={() => setSortBy("score")}
                  className="rounded-lg"
                >
                  Skor
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Cards */}
        <div className="grid grid-cols-1 gap-6">
          {filteredHistory.length === 0 ? (
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Belum ada riwayat
                </h3>
                <p className="text-gray-600 mb-6">
                  Kamu belum mengerjakan try out dengan filter yang dipilih
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((item, index) => (
              <Card
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Section - Main Info */}
                    <div className="flex-1 p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <Badge
                              variant={
                                item.category === "Saintek"
                                  ? "default"
                                  : "secondary"
                              }
                              className="font-semibold"
                            >
                              {item.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="font-semibold border-emerald-300 text-emerald-700 bg-emerald-50"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {item.status === "completed"
                                ? "Selesai"
                                : "In Progress"}
                            </Badge>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(item.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{item.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              <span>
                                {item.questionsAnswered}/{item.totalQuestions}{" "}
                                soal
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Score Badge */}
                        <div
                          className={`flex-shrink-0 ${getScoreBgColor(
                            item.score,
                            item.maxScore
                          )} rounded-2xl p-6 border-2 text-center min-w-[140px]`}
                        >
                          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                            Skor Total
                          </div>
                          <div
                            className={`text-4xl font-bold ${getScoreColor(
                              item.score,
                              item.maxScore
                            )}`}
                          >
                            {item.score}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            dari {item.maxScore}
                          </div>
                          <div className="mt-2">
                            <span
                              className={`text-xs font-bold ${getScoreColor(
                                item.score,
                                item.maxScore
                              )}`}
                            >
                              {Math.round((item.score / item.maxScore) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                          Rincian Skor per Subtes
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                            <div className="text-xs text-blue-700 font-semibold mb-1">
                              PU
                            </div>
                            <div className="text-xl font-bold text-blue-900">
                              {item.breakdown.pu}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                            <div className="text-xs text-purple-700 font-semibold mb-1">
                              PPU
                            </div>
                            <div className="text-xl font-bold text-purple-900">
                              {item.breakdown.ppu}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
                            <div className="text-xs text-green-700 font-semibold mb-1">
                              PBM
                            </div>
                            <div className="text-xl font-bold text-green-900">
                              {item.breakdown.pbm}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200">
                            <div className="text-xs text-orange-700 font-semibold mb-1">
                              PK
                            </div>
                            <div className="text-xl font-bold text-orange-900">
                              {item.breakdown.pk}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200">
                            <div className="text-xs text-red-700 font-semibold mb-1">
                              Lit. Indo
                            </div>
                            <div className="text-xl font-bold text-red-900">
                              {item.breakdown.literasiIndo}
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-4 border border-yellow-200">
                            <div className="text-xs text-yellow-700 font-semibold mb-1">
                              Lit. Eng
                            </div>
                            <div className="text-xl font-bold text-yellow-900">
                              {item.breakdown.literasiEng}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="border-t border-gray-100 pt-6 mt-6">
                        <div className="flex flex-wrap gap-3">
                          <Button className="flex items-center gap-2 rounded-xl">
                            <Eye className="w-4 h-4" />
                            Lihat Detail
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 rounded-xl"
                          >
                            <Download className="w-4 h-4" />
                            Unduh Hasil
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModule;
