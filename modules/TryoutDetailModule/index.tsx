"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { BACKEND_URL } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

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
  Loader2,
} from "lucide-react";

import { TryoutDetail } from "./interface";

const TryoutDetailModule = () => {
  const router = useRouter();
  const params = useParams();

  const tryoutId = useMemo(() => {
    const id = (params as any)?.id;
    return Array.isArray(id) ? id[0] : id;
  }, [params]);

  const { data: session } = useSession();

  const [tryoutData, setTryoutData] = useState<TryoutDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [completedSubtests, setCompletedSubtests] = useState<number[]>([]);

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isStartingAttempt, setIsStartingAttempt] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    if (!tryoutId) return;

    setIsUnlocking(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/tryout/${tryoutId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal membuka pembahasan");
      }

      // Refresh data untuk memperbarui status unlockedSolutions
      await fetchDetail();
    } catch (e: any) {
      setError(e?.message || "Terjadi kesalahan saat membuka pembahasan");
    } finally {
      setIsUnlocking(false);
    }
  };

  const fetchDetail = async () => {
    if (!tryoutId) return;

    setError("");
    try {
      setIsLoading(true);

      const res = await fetch(`${BACKEND_URL}/tryout/${tryoutId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Gagal mengambil data try out");
      }

      const data = await res.json();

      const mappedData: TryoutDetail = {
        id: data.id,
        title: data.title,
        description: data.description || "Tidak ada deskripsi",
        badge: data.badge || "UTBK",
        number: data.number || "1",

        isFree: data.isFree,
        tokenCost: data.tokenCost,

        participants: data.participants ?? 0,
        totalQuestions: data.totalQuestions ?? 0,
        duration: data.duration ?? 0,
        startDate: data.startDate,
        endDate: data.endDate,

        isRegistered: !!data.isRegistered,
        unlockedSolutions: data.unlockedSolutions || [],

        benefits: data.benefits || [],
        requirements: data.requirements || [],

        categories: data.categories || [],

        latestFinishedAttemptId: data.latestFinishedAttemptId ?? null,
        latestAttemptStatus: data.latestAttemptStatus ?? null,
      };

      setTryoutData(mappedData);

      const finishedIds = (mappedData.categories || [])
        .filter((cat: any) => cat?.isCompleted)
        .map((cat: any) => cat?.id);

      setCompletedSubtests(finishedIds);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err?.message || "Gagal mengambil data try out");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [tryoutId]);

  const startAttempt = async (): Promise<string> => {
    if (!tryoutId) throw new Error("Tryout ID tidak ditemukan.");
    if (!session?.user?.id) {
      throw new Error("Kamu belum login atau session belum siap.");
    }

    const res = await fetch(`${BACKEND_URL}/exam/${tryoutId}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: session.user.id }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(msg || "Gagal memulai attempt");
    }

    const data = await res.json();

    const id = data?.attemptId || data?.id;
    if (!id)
      throw new Error(
        "Attempt berhasil dibuat, tapi attemptId tidak ditemukan di response.",
      );

    return String(id);
  };

  const ensureAttempt = async (): Promise<string> => {
    if (attemptId) return attemptId;

    setIsStartingAttempt(true);
    try {
      const id = await startAttempt();
      setAttemptId(id);
      return id;
    } finally {
      setIsStartingAttempt(false);
    }
  };

  const handleRegister = async () => {
    if (!tryoutId) return;

    setIsRegistering(true);
    setError("");

    try {
      // Jika sudah finish, tidak perlu start attempt baru
      if (tryoutData?.latestAttemptStatus !== "FINISHED") {
        await ensureAttempt();
      }
      setTryoutData((prev) => (prev ? { ...prev, isRegistered: true } : prev));
      setShowStartModal(true);
    } catch (e: any) {
      setError(e?.message || "Gagal memulai tryout");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleStart = async () => {
    setError("");
    // Jika status sudah FINISHED, jangan panggil ensureAttempt (agar tidak buat attempt baru)
    if (tryoutData?.latestAttemptStatus === "FINISHED") {
      setShowStartModal(true);
      return;
    }

    try {
      await ensureAttempt();
      setShowStartModal(true);
    } catch (e: any) {
      setError(e?.message || "Gagal memulai tryout");
    }
  };

  const handleStartSubtest = async (
    subtestId: number,
    isCompletedSubtest = false,
  ) => {
    if (!tryoutId || !tryoutData) return;

    // 1. Tentukan apakah masuk ke Mode Review
    const isReviewMode =
      tryoutData.latestAttemptStatus === "FINISHED" || isCompletedSubtest;

    if (isReviewMode) {
      // 2. CEK PROTEKSI PEMBAYARAN: Jika tidak gratis dan belum di-unlock
      const needsUnlock =
        !tryoutData.isFree && tryoutData.unlockedSolutions.length === 0;

      if (needsUnlock) {
        setError(
          "Pembahasan ini terkunci. Silakan klik 'Buka Pembahasan' terlebih dahulu.",
        );
        return;
      }

      // 3. Ambil ID Attempt untuk review
      const finishedAttemptId = tryoutData.latestFinishedAttemptId;

      if (!finishedAttemptId) {
        setError("Data pembahasan belum tersedia. Silakan refresh halaman.");
        return;
      }

      // Navigasi ke Review Mode
      router.push(
        `/tryout/${tryoutId}/exam/${subtestId}?review=true&attemptId=${encodeURIComponent(
          finishedAttemptId,
        )}`,
      );
      return;
    }

    // --- Mode Ujian Normal ---
    setError("");
    try {
      const id = await ensureAttempt();
      router.push(
        `/tryout/${tryoutId}/exam/${subtestId}?attemptId=${encodeURIComponent(
          id,
        )}`,
      );
    } catch (e: any) {
      setError(e?.message || "Gagal memulai subtes");
    }
  };

  const isSubtestLocked = (subtestIndex: number) => {
    if (!tryoutData) return true;
    // Jika sudah FINISHED, semua subtest terbuka untuk direview
    if (tryoutData.latestAttemptStatus === "FINISHED") return false;

    if (subtestIndex === 0) return false;
    const previousSubtestId = tryoutData.categories[subtestIndex - 1]?.id;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">
          Sedang memuat data try out...
        </p>
      </div>
    );
  }

  if (error || !tryoutData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-bold text-gray-900">Gagal Memuat Data</h3>
        <p className="text-gray-500">{error || "Try Out tidak ditemukan"}</p>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/tryout")} variant="outline">
            Kembali
          </Button>
          <Button onClick={fetchDetail} variant="primary">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pl-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Button - Fixed path to avoid history loops */}
        <Button
          variant="ghost"
          onClick={() => router.push("/tryout")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar
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
                      {Number(tryoutData.participants).toLocaleString()}
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
                    {/* Cek apakah pembahasan perlu dibeli atau sudah terbuka */}
                    {tryoutData.latestAttemptStatus === "FINISHED" &&
                    !tryoutData.isFree &&
                    tryoutData.unlockedSolutions.length === 0 ? (
                      <>
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Lock className="w-7 h-7 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            Pembahasan Terkunci
                          </h3>
                          <p className="text-gray-600">
                            Gunakan token untuk membuka pembahasan lengkap dan
                            analisis hasil.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {tryoutData.latestAttemptStatus === "FINISHED"
                              ? "Ujian Telah Selesai!"
                              : "Kamu Sudah Terdaftar!"}
                          </h3>
                          <p className="text-gray-600">
                            {tryoutData.latestAttemptStatus === "FINISHED"
                              ? "Pelajari kembali hasil pengerjaanmu melalui pembahasan"
                              : "Mulai try out sekarang dan ukur kemampuanmu"}
                          </p>
                        </div>
                      </>
                    )}
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
                  <>
                    {/* JIKA SUDAH FINISH */}
                    {tryoutData.latestAttemptStatus === "FINISHED" ? (
                      <>
                        {/* CEK APAKAH SUDAH UNLOCK ATAU GRATIS */}
                        {tryoutData.isFree ||
                        tryoutData.unlockedSolutions.length > 0 ? (
                          <Button
                            onClick={handleStart}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                          >
                            <BookOpen className="w-5 h-5" />
                            Lihat Pembahasan
                          </Button>
                        ) : (
                          <Button
                            onClick={handleUnlock}
                            disabled={isUnlocking}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                          >
                            {isUnlocking ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Lock className="w-5 h-5" />
                            )}
                            Buka Pembahasan ({tryoutData.tokenCost} Token)
                          </Button>
                        )}
                      </>
                    ) : (
                      /* JIKA MASIH BERJALAN ATAU BARU DAFTAR */
                      <Button
                        onClick={handleStart}
                        disabled={isStartingAttempt}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {isStartingAttempt ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Play className="w-5 h-5" />
                        )}
                        {tryoutData.latestAttemptStatus === "IN_PROGRESS"
                          ? "Lanjutkan Ujian"
                          : "Mulai Sekarang"}
                      </Button>
                    )}
                  </>
                ) : (
                  /* JIKA BELUM DAFTAR */
                  <Button
                    onClick={handleRegister}
                    disabled={isRegistering || isStartingAttempt}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                    Daftar Sekarang
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DETAIL & SUBTESTS UI */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
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
          </div>
        </div>

        {/* Start Tryout Modal */}
        <Dialog open={showStartModal} onOpenChange={setShowStartModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {tryoutData.latestAttemptStatus === "FINISHED"
                  ? "Pembahasan Try Out"
                  : "Mulai Try Out"}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {tryoutData.latestAttemptStatus === "FINISHED"
                  ? "Pilih subtes untuk melihat pembahasan soal dan kunci jawaban."
                  : "Pilih subtes untuk memulai. Subtes harus dikerjakan secara berurutan."}
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
                    const isCompleted =
                      completedSubtests.includes(category.id) ||
                      tryoutData.latestAttemptStatus === "FINISHED";

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
                            </div>

                            <Button
                              onClick={() =>
                                handleStartSubtest(index + 1, isCompleted)
                              } // Untuk Literasi gunakan actualIndex + 1
                              disabled={
                                isLocked ||
                                isStartingAttempt ||
                                (tryoutData.latestAttemptStatus ===
                                  "FINISHED" &&
                                  !tryoutData.isFree &&
                                  tryoutData.unlockedSolutions.length === 0)
                              }
                              className={`${
                                isLocked
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : isCompleted
                                    ? tryoutData.latestAttemptStatus ===
                                        "FINISHED" &&
                                      !tryoutData.isFree &&
                                      tryoutData.unlockedSolutions.length === 0
                                      ? "bg-orange-400 text-white" // Warna orange untuk status terkunci
                                      : "bg-emerald-500 hover:bg-emerald-600"
                                    : "bg-blue-500 hover:bg-blue-600"
                              } text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-60`}
                            >
                              {isStartingAttempt ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : tryoutData.latestAttemptStatus ===
                                  "FINISHED" || isCompleted ? (
                                <>
                                  {/* Jika Belum Unlock dan Tidak Gratis, Tampilkan Icon Gembok */}
                                  {!tryoutData.isFree &&
                                  tryoutData.unlockedSolutions.length === 0 ? (
                                    <>
                                      <Lock className="w-4 h-4" />
                                      Terkunci
                                    </>
                                  ) : (
                                    <>
                                      <BookOpen className="w-4 h-4" />
                                      Pembahasan
                                    </>
                                  )}
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
                    const isCompleted =
                      completedSubtests.includes(category.id) ||
                      tryoutData.latestAttemptStatus === "FINISHED";

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
                            </div>

                            <Button
                              onClick={() =>
                                handleStartSubtest(actualIndex + 1, isCompleted)
                              }
                              disabled={isLocked || isStartingAttempt}
                              className={`${
                                isLocked
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : isCompleted
                                    ? "bg-emerald-500 hover:bg-emerald-600"
                                    : "bg-blue-500 hover:bg-blue-600"
                              } text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-60`}
                            >
                              {isStartingAttempt ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : tryoutData.latestAttemptStatus ===
                                  "FINISHED" || isCompleted ? (
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TryoutDetailModule;