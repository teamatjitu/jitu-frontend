"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Plus,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Ticket,
  FileText,
  Target,
} from "lucide-react";
import { stats, subjects, tryOutData } from "./payload";
import { Stat, Subject, TryOutCard } from "./interface";
import { useRouter } from "next/navigation";

const TryoutModule = () => {
  const router = useRouter();

  const handleTryoutClick = (id: number) => {
    router.push(`/tryout/${id}`);
  };

  return (
    <div className="min-h-screen pl-20 bg-gray-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="pt-8 pb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Try Out UTBK
          </h1>
          <p className="text-gray-600">
            Mulai perjalanan belajar dan latihan kamu di sini
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-[#1A7BFF] to-[#0D5FD9] rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden border-0 hover:shadow-blue-500/30 transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 bg-blue-200 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/30 shadow-xl">
                  H
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#1A7BFF] flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Hakim Nizami
                </h2>
                <p className="text-blue-100 flex items-center gap-2 text-sm sm:text-base mb-2">
                  <Target className="w-4 h-4" />
                  Target: UTBK 2026
                </p>
              </div>
            </div>

            <div className="bg-blue-400/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/30 w-full sm:w-auto">
              <div className="text-3xl sm:text-4xl font-bold mb-1">0</div>
              <div className="text-sm text-blue-100 mb-3">Kuota Premium</div>
              <Button
                variant={"outline"}
                className="w-full bg-white text-[#1A7BFF] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Beli Kuota
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat: Stat, index) => (
            <Card
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Banner */}
        <Card className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl shadow-orange-500/20 border-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
                Mulai Perjalanan Belajarmu!
                <TrendingUp className="w-7 h-7" />
              </h3>
              <p className="text-orange-100 mb-6 text-sm sm:text-base">
                Beli kuota Try Out atau daftar Try Out gratis untuk mulai
                latihan dan raih impianmu!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Beli Kuota Premium
                </Button>
                <Button
                  variant={"outline"}
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Daftar Try Out Gratis
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <BookOpen className="w-32 h-32 opacity-20" />
            </div>
          </div>
        </Card>

        {/* Try Out Section */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Try Out Tersedia
              </h2>
              <p className="text-gray-600">
                Pilih try out yang sesuai dengan tujuan kamu
              </p>
            </div>
            <Button
              variant={"ghost"}
              className="flex items-center gap-2 text-[#1A7BFF] hover:text-[#1568E6] font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tryOutData.map((item: TryOutCard) => (
              <Card
                key={item.id}
                onClick={() => handleTryoutClick(item.id)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-blue-200 rounded-2xl flex items-center justify-center transition-all shadow-sm">
                        <span className="text-3xl font-black text-gray-700 group-hover:text-[#1A7BFF] transition-colors">
                          {item.number}
                        </span>
                      </div>
                      <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4 group-hover:text-[#1A7BFF] transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Gratis & Berbayar
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      <Users className="w-4 h-4" />
                      {item.participants.toLocaleString()}
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

export default TryoutModule;
