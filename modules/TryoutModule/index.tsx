"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Users,
  Plus,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Ticket,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { stats, subjects, tryOutData } from "./payload";
import { Stat, Subject, TryOutCard } from "@/types";

const TryoutModule = () => {
  const { open } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-20 mt-24 p-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-linear-to-br from-[#1A7BFF] to-[#0D5FD9] rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/30">
                H
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Hakim Nizami</h2>
                <p className="text-blue-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Target: UTBK 2026
                </p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <div className="text-4xl font-bold mb-1">0</div>
              <div className="text-sm text-blue-100">Kuota Premium</div>
              <Button
                variant={"outline"}
                className="mt-3 bg-white text-[#1A7BFF] px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Beli
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          {stats.map((stat: Stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-linear-to-r from-orange-500 to-pink-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl shadow-orange-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-bold mb-2 flex items-center gap-2">
                Mulai Perjalanan Belajarmu!
                <TrendingUp className="w-8 h-8" />
              </h3>
              <p className="text-orange-100 mb-6">
                Beli kuota Try Out atau daftar Try Out gratis untuk mulai
                latihan dan raih impianmu!
              </p>
              <div className="flex gap-3">
                <Button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-xl hover:scale-105 flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Beli Kuota Premium
                </Button>
                <Button
                  variant={"outline"}
                  className="bg-white/20 backdrop-blur-xl border-2 border-white/50 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Daftar Try Out
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <BookOpen className="w-32 h-32 opacity-20" />
            </div>
          </div>
        </div>

        {/* Try Out Section - Carousel Style */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Try Out Tersedia
              </h2>
              <p className="text-gray-500">Pilih try out yang sesuai untukmu</p>
            </div>
            <Button
              variant={"ghost"}
              className="flex items-center gap-2 text-[#1A7BFF] hover:text-[#1568E6] font-semibold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tryOutData.map((item: TryOutCard) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-sm p-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-linear-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-blue-200 rounded-2xl flex items-center justify-center transition-all">
                      <span className="text-3xl font-black text-gray-700 group-hover:text-[#1A7BFF]">
                        {item.number}
                      </span>
                    </div>
                    <span className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-4 group-hover:text-[#1A7BFF] transition-colors">
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
              </div>
            ))}
          </div>
        </div>

        {/* Subjects Section - Grid Style */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Materi Pembelajaran
              </h2>
              <p className="text-gray-500">Eksplorasi materi UTBK TPS</p>
            </div>
            <Button
              variant={"outline"}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold bg-white border-2 border-gray-200 px-4 py-2 rounded-xl hover:border-gray-300 transition-all"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((subject: Subject) => (
              <div
                key={subject.id}
                className="group bg-white rounded-2xl shadow-sm p-8"
              >
                <div
                  className={`w-full aspect-square bg-linear-to-br ${subject.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <subject.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2 group-hover:text-[#1A7BFF] transition-colors">
                  {subject.title}
                </h3>
                <p className="text-xs text-gray-500 font-semibold">
                  {subject.count} Soal
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryoutModule;
