"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Trophy,
  Target,
  BarChart3,
  Users,
  Brain,
  Coins,
  Calendar,
  BookOpen,
  Calculator,
  PenTool,
  Globe,
  Languages,
} from "lucide-react";

// --- Mock Data ---
const SUBJECTS_DATA = [
  {
    id: 1,
    name: "Penalaran Umum",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 2,
    name: "Pengetahuan Kuantitatif",
    icon: Calculator,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    name: "Pemahaman Bacaan",
    icon: BookOpen,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    id: 4,
    name: "Penalaran Matematika",
    icon: BarChart3,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: 5,
    name: "Literasi Bahasa Indonesia",
    icon: PenTool,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    id: 6,
    name: "Literasi Bahasa Inggris",
    icon: Languages,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

const PublicNavbar = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image
              src="/logo.png"
              alt="JituPTN Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              JituPTN
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Fitur
            </a>
            <a
              href="#subjects"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Materi
            </a>
            <a
              href="#preview"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Tryout
            </a>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
              >
                Dashboard Saya
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/login")}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Masuk
                </Button>
                <Button
                  onClick={() => router.push("/register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-200"
                >
                  Daftar Gratis
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="JituPTN Logo"
              width={32}
              height={32}
              className="opacity-90  brightness-200"
            />
            <span className="text-xl font-bold">JituPTN</span>
          </div>
          <p className="text-gray-400 text-sm">
            Platform simulasi Tryout UTBK SNBT terbaik dengan sistem penilaian
            IRT dan analisis mendalam.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Layanan</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Tryout SNBT
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Analisis Peluang
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Bank Soal
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Perusahaan</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Hubungi Kami
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Syarat & Ketentuan
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Ikuti Kami</h4>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-all">
              IG
            </div>
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-all">
              TW
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
        © 2026 Jitu Academy. All rights reserved.
      </div>
    </div>
  </footer>
);

const LandingPageModule = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false); // Set false to show mock data immediately or skeleton

  const [activeTryOuts, setActiveTryOuts] = useState<any[]>([
    {
      id: "5",
      title: "Try Out UTBK SNBT 5 2026",
      badge: "SNBT",
      participants: 8016,
      isFree: true,
      dateRange: "9 - 18 Jan 2026",
    },
    {
      id: "4",
      title: "Try Out UTBK SNBT 4 2026",
      badge: "SNBT",
      participants: 22665,
      isFree: true,
      dateRange: "1 - 8 Jan 2026",
    },
    {
      id: "3",
      title: "Try Out UTBK SNBT 3 2026",
      badge: "SNBT",
      participants: 18540,
      isFree: false,
      dateRange: "Des 2025",
    },
  ]);

  return (
    <div className="min-h-screen pt-20 bg-white font-sans">
      <PublicNavbar />

      {/* 1. HERO SECTION */}
      <section className="bg-[url('/grid-pattern.svg')] bg-fixed bg-center pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Taklukkan <span className="text-blue-600">UTBK SNBT</span> <br />
            Masuk PTN Impian.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Simulasi ujian dengan sistem penilaian IRT, analisis peluang lolos
            real-time, dan gamifikasi yang membuat belajar jadi ketagihan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              onClick={() => router.push(session ? "/dashboard" : "/register")}
              className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl transition-all hover:scale-105"
            >
              {session ? "Buka Dashboard" : "Daftar Sekarang - Gratis"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("#preview")}
              className="h-14 px-8 text-lg rounded-full border-2 hover:bg-gray-50 text-gray-700"
            >
              Lihat Jadwal Tryout
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 max-w-4xl mx-auto border-t border-gray-100 mt-16">
            {[
              { label: "Siswa Bergabung", value: "150rb+" },
              { label: "Total Tryout", value: "50+" },
              { label: "Soal Terupdate", value: "10rb+" },
              { label: "PTN Terdata", value: "95+" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kenapa Memilih Jitu Academy?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami tidak hanya memberikan soal, tapi juga strategi dan teknologi
              untuk memaksimalkan skormu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Sistem IRT & Blocking Time",
                desc: "Simulasi persis seperti aslinya. Penilaian menggunakan Item Response Theory untuk akurasi prediksi skor.",
                color: "text-red-600",
                bg: "bg-red-50",
              },
              {
                icon: BarChart3,
                title: "Analisis Mendalam",
                desc: "Ketahui kelemahanmu per subtes. Dapatkan rekomendasi materi yang harus dipelajari ulang.",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Brain,
                title: "Soal High Order Thinking",
                desc: "Kumpulan soal HOTS terbaru yang disusun oleh tim ahli sesuai kisi-kisi SNPMB 2026.",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((feature, idx) => (
              <Card
                key={idx}
                className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. GAMIFICATION SECTION */}
      <section
        id="gamification"
        className="py-24 overflow-hidden relative bg-slate-50"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">
                Kumpulkan Token & <br /> Jaga Daily Streak!
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Bosan dengan cara belajar lama? Di Jitu Academy, konsistensimu
                dihargai. Kerjakan soal harian, pertahankan api streak, dan
                kumpulkan token untuk membuka kunci pembahasan premium.
              </p>
              <ul className="space-y-4">
                {[
                  "Jawab soal harian untuk dapat Streak",
                  "Tukarkan Token dengan Pembahasan Soal",
                  "Leaderboard mingguan berhadiah",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => router.push("/register")}
                className="bg-gray-900 text-white px-8 py-6 rounded-xl hover:bg-gray-800 shadow-lg"
              >
                Mulai Kumpulkan Token
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 grid gap-6">
                <Card className="bg-white shadow-2xl border-orange-100 transform md:-rotate-2 hover:rotate-0 transition-transform duration-500">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-orange-100 p-4 rounded-full">
                      <Trophy className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">
                        Current Streak
                      </p>
                      <h4 className="text-3xl font-bold text-gray-900">
                        7 Hari 🔥
                      </h4>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-white shadow-2xl border-blue-100 transform md:translate-x-12 md:rotate-2 hover:rotate-0 transition-transform duration-500">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <Coins className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">
                        Token Balance
                      </p>
                      <h4 className="text-3xl font-bold text-gray-900">
                        250 JituPoints
                      </h4>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SUBJECTS SECTION (Materi) */}
      <section id="subjects" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Materi Lengkap UTBK
            </h2>
            <p className="text-gray-600">
              Pelajari semua subtes yang diujikan secara mendalam.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SUBJECTS_DATA.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Card
                  key={subject.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group hover:-translate-y-1"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <div
                      className={`${subject.bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className={`w-8 h-8 ${subject.color}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight min-h-[40px] flex items-center justify-center">
                      {subject.name}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PREVIEW TRYOUTS */}
      <section id="preview" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Jadwal Tryout Terdekat
              </h2>
              <p className="text-gray-600">
                Siapkan dirimu, kursi terbatas untuk sesi live.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-blue-600 hover:bg-blue-50"
              onClick={() => router.push("/login")}
            >
              Lihat Semua <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {activeTryOuts.map((tryOut) => (
              <Card
                key={tryOut.id}
                className="group hover:shadow-lg transition-all duration-300 border-gray-200 bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge
                      className={`${tryOut.isFree ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"} hover:bg-opacity-80`}
                    >
                      {tryOut.isFree ? "Gratis" : "Premium"}
                    </Badge>
                    <span className="text-xs font-semibold text-gray-400 border border-gray-200 px-2 py-1 rounded">
                      {tryOut.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {tryOut.title}
                  </h3>
                  <div className="space-y-2 mb-6">
                    {tryOut.dateRange && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{tryOut.dateRange}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>
                        {tryOut.participants.toLocaleString()} Peserta
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 font-semibold transition-all"
                    onClick={() => router.push("/login")}
                  >
                    Ikuti Tryout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA BOTTOM */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Siap Mengejar Kampus Impian?
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto text-lg">
              Bergabunglah dengan ribuan pejuang PTN lainnya. Mulai dari gratis,
              upgrade kapan saja.
            </p>
            <Button
              onClick={() => router.push("/register")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-full font-bold shadow-lg transition-transform hover:scale-105"
            >
              Daftar Akun Gratis
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-10 -mb-10 blur-2xl" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPageModule;
