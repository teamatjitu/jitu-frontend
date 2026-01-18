"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  Users,
  Plus,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Ticket,
  FileText,
  Target,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Local Interfaces & Payloads
import { stats } from "./payload"; // Kita tetap pakai stats dummy dulu
import { Stat, TryOutCard } from "./interface";
import { checkReferralCode } from "@/modules/ReferralModule/payload";
import { ReferralCheckResult } from "@/modules/ReferralModule/interface";

// Config
import { BACKEND_URL } from "@/lib/api";

const TryoutModule = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // --- States ---
  const [tryouts, setTryouts] = useState<TryOutCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Referral States
  const [referralCode, setReferralCode] = useState<string>("");
  const [checkResult, setCheckResult] = useState<ReferralCheckResult | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(false);

  // --- Effects ---

  // 1. Fetch Data Tryout dari Backend
  // 1. Fetch Data Tryout dari Backend
  useEffect(() => {
    const fetchTryouts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BACKEND_URL}/tryout`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Tambahkan ini jika menggunakan session/cookie
        });

        if (!res.ok) throw new Error("Gagal mengambil data tryout");

        const data = await res.json();

        // Mapping response backend ke UI Frontend
        // Sesuai dengan TryOutCardDto di backend Anda
        const mappedData: TryOutCard[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          // KUNCI: Backend sudah mengirimkan 'number' dan 'participants'
          // Jangan dihitung ulang dengan Regex atau _count lagi
          number: item.number || "?",
          participants: item.participants || 0,
          badge: item.badge || "SNBT",
          canEdit: false,
        }));

        setTryouts(mappedData);
      } catch (error) {
        console.error("Error fetching tryouts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTryouts();
  }, []);

  // --- Handlers ---

  const handleTryoutClick = (id: number) => {
    router.push(`/tryout/${id}`);
  };

  const handleCheckReferral = () => {
    setIsChecking(true);
    // Simulasi delay API referral (bisa diganti fetch nanti)
    setTimeout(() => {
      const result = checkReferralCode(referralCode);
      setCheckResult(result);
      setIsChecking(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCheckReferral();
    }
  };

  // --- Render ---

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
        <Card className="bg-linear-to-br from-[#1A7BFF] to-[#0D5FD9] rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden border-0 hover:shadow-blue-500/30 transition-shadow duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-20 h-20 bg-blue-200 rounded-2xl flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/30 shadow-xl">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 rounded-full border-4 border-[#1A7BFF] flex items-center justify-center shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  {session?.user?.name || "User"}
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

        {/* Referral Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Kode Referral
            </h2>
            <p className="text-gray-600">
              Masukkan kode referral untuk mendapatkan benefit spesial
            </p>
          </div>

          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Cek Kode Referral
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="referralCode"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Masukkan Kode Referral
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="referralCode"
                        type="text"
                        placeholder="Contoh: JITU2026"
                        value={referralCode}
                        onChange={(e) =>
                          setReferralCode(e.target.value.toUpperCase())
                        }
                        onKeyPress={handleKeyPress}
                        className="pl-10 h-12 text-base uppercase"
                      />
                    </div>
                    <Button
                      onClick={handleCheckReferral}
                      disabled={isChecking || !referralCode.trim()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 h-12 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isChecking ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Mengecek...
                        </span>
                      ) : (
                        "Cek Kode"
                      )}
                    </Button>
                  </div>
                </div>

                {checkResult && (
                  <div
                    className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                      checkResult.exists
                        ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                        : "bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                          checkResult.exists
                            ? "bg-gradient-to-br from-emerald-500 to-green-500"
                            : "bg-gradient-to-br from-red-500 to-orange-500"
                        }`}
                      >
                        {checkResult.exists ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : (
                          <XCircle className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-bold mb-2 ${
                            checkResult.exists
                              ? "text-emerald-900"
                              : "text-red-900"
                          }`}
                        >
                          {checkResult.message}
                        </h3>

                        {checkResult.exists && checkResult.ownerName && (
                          <p className="text-sm text-emerald-700 mb-4">
                            Kode dari:{" "}
                            <span className="font-semibold">
                              {checkResult.ownerName}
                            </span>
                          </p>
                        )}

                        {checkResult.exists && checkResult.benefits && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold text-emerald-900 mb-3">
                              Benefit yang kamu dapatkan:
                            </p>
                            <ul className="space-y-2">
                              {checkResult.benefits.map((benefit, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-sm text-emerald-800"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                            </ul>

                            <Button className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                              Gunakan Kode Ini
                            </Button>
                          </div>
                        )}

                        {!checkResult.exists && (
                          <p className="text-sm text-red-700 mt-2">
                            Pastikan kode yang kamu masukkan benar atau hubungi
                            teman yang membagikan kode referral.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!checkResult && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                      💡 Kode referral biasanya terdiri dari huruf dan angka.
                      Tanyakan kepada teman yang sudah bergabung!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Try Out Section (DYNAMIC) */}
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

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : tryouts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Belum ada Try Out
              </h3>
              <p className="text-gray-500 mt-1">
                Saat ini belum ada jadwal try out yang tersedia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tryouts.map((item: TryOutCard) => (
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

                    <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4 group-hover:text-[#1A7BFF] transition-colors line-clamp-2">
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
          )}
        </section>
      </div>
    </div>
  );
};

export default TryoutModule;
