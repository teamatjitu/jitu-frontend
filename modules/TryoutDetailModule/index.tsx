"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BACKEND_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  Coins,
  Play,
  Gift,
  BookOpen,
  TrendingUp,
  Award,
  Video,
  Lock,
  Loader2, // Tambah icon loader
} from "lucide-react";
import { TryoutDetail } from "./interface";

// Interface Props dihapus karena kita fetch internal
// interface TryoutDetailModuleProps { ... }

const TryoutDetailModule = () => {
  const router = useRouter();
  const params = useParams();
  const tryoutId = params.id; // Ambil ID dari URL

  // 1. STATE MANAGEMENT
  const [tryoutData, setTryoutData] = useState<TryoutDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // UI States
  const [isRegistering, setIsRegistering] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [completedSubtests, setCompletedSubtests] = useState<number[]>([]);

  // 2. FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchDetail = async () => {
      if (!tryoutId) return;

      try {
        setIsLoading(true);
        const res = await fetch(`${BACKEND_URL}/tryout/${tryoutId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // PENTING: Supaya backend tau user login
        });

        if (!res.ok) throw new Error("Gagal mengambil data try out");

        const data = await res.json();

        // 3. MAPPING DATA (Backend -> UI)
        // Karena struktur DB kamu simple, kita lengkapi data yang kurang di sini
        // agar UI kompleks kamu tetap jalan.
        const mappedData: TryoutDetail = {
          id: data.id,
          title: data.title,
          description: data.description || "Tidak ada deskripsi",
          badge: data.badge || "UTBK", // Backend kirim 'badge', bukan 'category'
          number: data.number || "1",
          isFree: data.isFree,        // Backend sudah kirim boolean isFree
          tokenCost: data.tokenCost,  // Backend sudah kirim tokenCost
          participants: data.participants,
          totalQuestions: data.totalQuestions,
          duration: data.duration,    // Backend sudah kirim total durasi kalkulasi
          startDate: data.startDate,
          endDate: data.endDate,
          isRegistered: data.isRegistered, // Backend sudah kirim status register user
          
          benefits: data.benefits || [],     // Gunakan data backend
          requirements: data.requirements || [], // Gunakan data backend
          
          // 👇 INI YANG PENTING: Ubah data.subtests jadi data.categories
          categories: data.categories || [] 
        };

        setTryoutData(mappedData);
        
        // Update completed subtests state
        const finishedIds = mappedData.categories
            .filter((cat: any) => cat.isCompleted)
            .map((cat: any) => cat.id);
        setCompletedSubtests(finishedIds);

      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [tryoutId]);

  // --- HANDLERS ---

  const handleRegister = async () => {
  if (!tryoutId) return;
  setIsRegistering(true);

  try {
    // 1. Panggil Endpoint Register di Backend
    // Pastikan endpoint ini sesuai dengan backend kamu, biasanya POST /tryout/:id/register
    const res = await fetch(`${BACKEND_URL}/api/exam/${tryoutId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      // Handle jika Token Habis
      if (res.status === 402 || data.message?.includes("token")) {
        alert("Token tidak cukup! Silakan beli token di menu Shop.");
        router.push("/shop");
        return;
      }
      throw new Error(data.message || "Gagal mendaftar tryout");
    }

    // 2. Sukses
    alert("Berhasil mendaftar! Selamat mengerjakan.");
    
    // Refresh halaman agar status berubah jadi "Terdaftar" & tombol berubah jadi "Mulai"
    window.location.reload();

  } catch (err: any) {
    console.error("Register Error:", err);
    alert(err.message);
  } finally {
    setIsRegistering(false);
  }
};

  const handleStart = () => {
    setShowStartModal(true);
  };

  const handleStartSubtest = (subtestId: number, isReview = false) => {
    const url = `/tryout/${tryoutId}/exam/${subtestId}${
      isReview ? "?review=true" : ""
    }`;
    router.push(url);
  };

  const isSubtestLocked = (subtestIndex: number) => {
    if (!tryoutData) return true;
    if (subtestIndex === 0) return false;
    const previousSubtestId = tryoutData.categories[subtestIndex - 1].id;
    return !completedSubtests.includes(previousSubtestId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --- RENDER LOADING & ERROR ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Sedang memuat data try out...</p>
      </div>
    );
  }

  if (error || !tryoutData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-bold text-gray-900">Gagal Memuat Data</h3>
        <p className="text-gray-500">{error || "Try Out tidak ditemukan"}</p>
        <Button onClick={() => router.back()} variant="outline">Kembali</Button>
      </div>
    );
  }

  // --- RENDER MAIN UI (Kode UI Asli Kamu) ---

  return (
    <div className="min-h-screen pl-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        {/* Header Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl shadow-blue-500/20 border-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>

          <CardContent className="p-8 sm:p-12 relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                    <span className="text-4xl font-black text-white">
                      {tryoutData.number}
                    </span>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {tryoutData.badge}
                  </Badge>
                  {tryoutData.isFree && (
                    <Badge className="bg-orange-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      GRATIS
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {tryoutData.title}
                </h1>

                <p className="text-blue-100 text-base sm:text-lg mb-6 leading-relaxed">
                  {tryoutData.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 text-blue-200 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">Peserta</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {tryoutData.participants.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 text-blue-200 mb-1">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs font-medium">Soal</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {tryoutData.totalQuestions}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 text-blue-200 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">Durasi</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {tryoutData.duration} mnt
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 text-blue-200 mb-1">
                      <Coins className="w-4 h-4" />
                      <span className="text-xs font-medium">Biaya</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {tryoutData.isFree
                        ? "FREE"
                        : `${tryoutData.tokenCost} Token`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Status & CTA */}
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                {tryoutData.isRegistered ? (
                  <>
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Kamu Sudah Terdaftar!
                      </h3>
                      <p className="text-gray-600">
                        Mulai try out sekarang dan ukur kemampuanmu
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Belum Terdaftar
                      </h3>
                      <p className="text-gray-600">
                        Daftar sekarang untuk mengikuti try out ini
                        {!tryoutData.isFree &&
                          ` (${tryoutData.tokenCost} Token)`}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {tryoutData.isRegistered ? (
                  <Button
                    onClick={handleStart}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Mulai Sekarang
                  </Button>
                ) : (
                  <Button
                    onClick={handleRegister}
                    disabled={isRegistering}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRegistering ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mendaftar...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Daftar Sekarang
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DETAIL & SUBTESTS UI (Sama persis seperti kodemu sebelumnya) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Period */}
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Periode Pelaksanaan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Mulai</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatDate(tryoutData.startDate)}
                    </div>
                  </div>
                  <div className="hidden sm:block w-12 h-0.5 bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Berakhir</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatDate(tryoutData.endDate)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Kategori Subtes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tryoutData.categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {category.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {category.questionCount} Soal
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {category.duration} Menit
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Award className="w-5 h-5 text-blue-600" />
                  Benefit yang Didapat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tryoutData.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Requirements */}
          <div className="space-y-6">
            {/* Requirements */}
            <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Persyaratan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tryoutData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 leading-relaxed text-sm">
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <CardContent className="p-6 relative z-10">
                <div className="text-center text-white">
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-90" />
                  <h3 className="font-bold text-lg mb-2">Video Pembahasan</h3>
                  <p className="text-sm text-orange-100 leading-relaxed">
                    Dapatkan akses video pembahasan lengkap setelah mengerjakan
                    try out
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
              <CardContent className="p-6 relative z-10">
                <div className="text-white">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Tips Mengerjakan
                  </h3>
                  <ul className="space-y-2 text-sm text-purple-100">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Kerjakan di tempat yang tenang</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Pastikan koneksi internet stabil</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Siapkan alat tulis untuk coret-coretan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Atur waktu dengan baik</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Start Tryout Modal */}
        <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Mulai Try Out
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Pilih subtes untuk memulai. Subtes harus dikerjakan secara
                berurutan.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Tes Potensi Skolastik Group */}
              <div>
                <h3 className="text-lg font-bold text-emerald-700 mb-3">
                  Tes Potensi Skolastik
                </h3>
                <div className="space-y-3">
                  {tryoutData.categories.slice(0, 4).map((category, index) => {
                    const isLocked = isSubtestLocked(index);
                    const isCompleted = completedSubtests.includes(category.id);

                    return (
                      <Card
                        key={category.id}
                        className={`border-2 transition-all ${
                          isLocked
                            ? "border-gray-200 bg-gray-50 opacity-60"
                            : isCompleted
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-blue-200 bg-blue-50 hover:shadow-md cursor-pointer"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    isLocked
                                      ? "bg-gray-300"
                                      : isCompleted
                                      ? "bg-emerald-500"
                                      : "bg-blue-500"
                                  }`}
                                >
                                  {isLocked ? (
                                    <Lock className="w-5 h-5 text-white" />
                                  ) : isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                  ) : (
                                    <span className="text-white font-bold">
                                      {index + 1}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h3
                                    className={`font-bold ${
                                      isLocked
                                        ? "text-gray-500"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {category.name}
                                  </h3>
                                  <div
                                    className={`flex items-center gap-4 text-sm ${
                                      isLocked
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    <span className="flex items-center gap-1">
                                      <FileText className="w-4 h-4" />
                                      {category.questionCount} Soal
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {category.duration} Menit
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {isLocked && (
                                <p className="text-xs text-gray-500 ml-13">
                                  Selesaikan subtes sebelumnya terlebih dahulu
                                </p>
                              )}
                              {isCompleted && (
                                <p className="text-xs text-emerald-600 ml-13 font-medium">
                                  ✓ Subtes sudah selesai dikerjakan
                                </p>
                              )}
                            </div>

                            <Button
                              onClick={() =>
                                handleStartSubtest(category.id, isCompleted)
                              }
                              disabled={isLocked}
                              className={`${
                                isLocked
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : isCompleted
                                  ? "bg-emerald-500 hover:bg-emerald-600"
                                  : "bg-blue-500 hover:bg-blue-600"
                              } text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2`}
                            >
                              {isCompleted ? (
                                <>
                                  <BookOpen className="w-4 h-4" />
                                  Lihat Pembahasan
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  Mulai
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Tes Literasi Group */}
              <div>
                <h3 className="text-lg font-bold text-emerald-700 mb-3">
                  Tes Literasi
                </h3>
                <div className="space-y-3">
                  {tryoutData.categories.slice(4, 7).map((category, index) => {
                    const actualIndex = index + 4;
                    const isLocked = isSubtestLocked(actualIndex);
                    const isCompleted = completedSubtests.includes(category.id);

                    return (
                      <Card
                        key={category.id}
                        className={`border-2 transition-all ${
                          isLocked
                            ? "border-gray-200 bg-gray-50 opacity-60"
                            : isCompleted
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-blue-200 bg-blue-50 hover:shadow-md cursor-pointer"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    isLocked
                                      ? "bg-gray-300"
                                      : isCompleted
                                      ? "bg-emerald-500"
                                      : "bg-blue-500"
                                  }`}
                                >
                                  {isLocked ? (
                                    <Lock className="w-5 h-5 text-white" />
                                  ) : isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                  ) : (
                                    <span className="text-white font-bold">
                                      {actualIndex + 1}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <h3
                                    className={`font-bold ${
                                      isLocked
                                        ? "text-gray-500"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {category.name}
                                  </h3>
                                  <div
                                    className={`flex items-center gap-4 text-sm ${
                                      isLocked
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    <span className="flex items-center gap-1">
                                      <FileText className="w-4 h-4" />
                                      {category.questionCount} Soal
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {category.duration} Menit
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {isLocked && (
                                <p className="text-xs text-gray-500 ml-13">
                                  Selesaikan subtes sebelumnya terlebih dahulu
                                </p>
                              )}
                              {isCompleted && (
                                <p className="text-xs text-emerald-600 ml-13 font-medium">
                                  ✓ Subtes sudah selesai dikerjakan
                                </p>
                              )}
                            </div>

                            <Button
                              onClick={() =>
                                handleStartSubtest(category.id, isCompleted)
                              }
                              disabled={isLocked}
                              className={`${
                                isLocked
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : isCompleted
                                  ? "bg-emerald-500 hover:bg-emerald-600"
                                  : "bg-blue-500 hover:bg-blue-600"
                              } text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2`}
                            >
                              {isCompleted ? (
                                <>
                                  <BookOpen className="w-4 h-4" />
                                  Lihat Pembahasan
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  Mulai
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Catatan Penting:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Subtes harus dikerjakan secara berurutan</li>
                    <li>• Pastikan koneksi internet stabil</li>
                    <li>• Jawaban akan tersimpan otomatis</li>
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TryoutDetailModule;