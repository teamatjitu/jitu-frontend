"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { TryoutDetail } from "./interface";

interface TryoutDetailModuleProps {
  tryoutId: number;
  tryoutData: TryoutDetail;
}

const TryoutDetailModule = ({ tryoutId, tryoutData }: TryoutDetailModuleProps) => {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    setIsRegistering(true);
    // Simulate registration API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRegistering(false);
    // Reload or update state
    window.location.reload();
  };

  const handleStart = () => {
    // Navigate to tryout execution page
    router.push(`/tryout/${tryoutId}/start`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
                      {tryoutData.isFree ? "FREE" : `${tryoutData.tokenCost} Token`}
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
                        {!tryoutData.isFree && ` (${tryoutData.tokenCost} Token)`}
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
                  <h3 className="font-bold text-lg mb-2">
                    Video Pembahasan
                  </h3>
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
      </div>
    </div>
  );
};

export default TryoutDetailModule;
