"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  ChevronRight,
  Zap,
  Globe,
  BookOpen,
  Calculator,
  FileText,
  Languages,
  Brain,
} from "lucide-react";

interface TryOut {
  id: string;
  title: string;
  number: string;
  badge: string;
  participants: number;
  dateRange?: string;
  isFree: boolean;
  status?: "active" | "available";
  canTake?: boolean;
}

interface Subject {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const LandingPageModule = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTryOuts, setActiveTryOuts] = useState<TryOut[]>([]);
  const [availableTryOuts, setAvailableTryOuts] = useState<TryOut[]>([]);
  const [subjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Penalaran Umum",
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: "2",
      name: "Pengetahuan dan Pemahaman Umum",
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "3",
      name: "Kemampuan Memahami Bacaan dan Menulis",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "4",
      name: "Pengetahuan Kuantitatif",
      icon: Calculator,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      id: "5",
      name: "Literasi dalam Bahasa Indonesia",
      icon: FileText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      id: "6",
      name: "Literasi dalam Bahasa Inggris",
      icon: Languages,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTryOuts = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

        const [activeResponse, availableResponse] = await Promise.all([
          fetch(`${backendUrl}/api/tryout/active`),
          fetch(`${backendUrl}/api/tryout/available`),
        ]);

        const activeData = await activeResponse.json();
        const availableData = await availableResponse.json();

        // Transform backend data to match component structure
        setActiveTryOuts(
          activeData.map((item: any) => ({
            ...item,
            dateRange: "9 Januari 2026 - 18 Januari 2026", // TODO: add to backend
            isFree: true, // TODO: add to backend
            status: "active",
            canTake: true,
          }))
        );

        setAvailableTryOuts(
          availableData.map((item: any) => ({
            ...item,
            isFree: true,
            status: "available",
          }))
        );
      } catch (error) {
        console.error("Error fetching try outs:", error);
        // Fallback to mock data if API fails
        setActiveTryOuts([
          {
            id: "5",
            title: "Try Out UTBK SNBT 5 2026",
            number: "5",
            badge: "SNBT",
            participants: 8016,
            dateRange: "9 Januari 2026 - 18 Januari 2026",
            isFree: true,
            status: "active",
            canTake: true,
          },
        ]);

        setAvailableTryOuts([
          {
            id: "4",
            title: "Try Out UTBK SNBT 4 2026",
            number: "4",
            badge: "SNBT",
            participants: 22665,
            isFree: true,
            status: "available",
          },
          {
            id: "3",
            title: "Try Out UTBK SNBT 3 2026",
            number: "3",
            badge: "SNBT",
            participants: 18540,
            isFree: true,
            status: "available",
          },
          {
            id: "2",
            title: "Try Out UTBK SNBT 2 2026",
            number: "2",
            badge: "SNBT",
            participants: 22195,
            isFree: true,
            status: "available",
          },
          {
            id: "1",
            title: "Try Out UTBK SNBT 1 2026",
            number: "1",
            badge: "SNBT",
            participants: 31316,
            isFree: true,
            status: "available",
          },
          {
            id: "14",
            title: "Try Out UTBK SNBT 14 2025",
            number: "14",
            badge: "SNBT",
            participants: 188663,
            isFree: true,
            status: "available",
          },
          {
            id: "13",
            title: "Try Out UTBK SNBT 13 2025",
            number: "13",
            badge: "SNBT",
            participants: 156594,
            isFree: true,
            status: "available",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTryOuts();
  }, []);

  const handleStartTryOut = (tryOutId: string) => {
    if (session) {
      router.push(`/tryout/${tryOutId}`);
    } else {
      router.push("/login");
    }
  };

  const handleViewAllTryOuts = () => {
    if (session) {
      router.push("/tryout");
    } else {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 pl-20 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* User Header Section - Only show if logged in */}
        {session && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl shadow-blue-500/20 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {session.user.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {session.user.name}
                  </h1>
                  <p className="text-blue-100 text-sm">{session.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/30 flex items-center gap-3">
                  <div className="text-3xl">🎫</div>
                  <div>
                    <div className="text-xs text-blue-100 font-medium">
                      Kuota Premium
                    </div>
                    <div className="text-2xl font-bold text-white">0</div>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/shop")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Zap className="w-5 h-5" />
                  Beli Kuota
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Try Out Berlangsung Section */}
        <section className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Try Out Berlangsung
              </h2>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                ACTIVE
              </span>
            </div>
            <p className="text-gray-600">
              Try Out yang sedang dalam periode pendaftaran
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTryOuts.map((tryOut) => (
              <Card
                key={tryOut.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 min-w-fit border border-emerald-200">
                      <Badge className="bg-emerald-500 text-white mb-3 font-bold">
                        {tryOut.badge}
                      </Badge>
                      <div className="text-4xl font-bold text-emerald-900">
                        {tryOut.number}
                      </div>
                      <div className="text-xs font-semibold text-emerald-700 mt-2">
                        Gratis dan Berbayar
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {tryOut.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        {tryOut.dateRange && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{tryOut.dateRange}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{tryOut.participants.toLocaleString()} Peserta</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleStartTryOut(tryOut.id)}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-all"
                      >
                        Mulai Sekarang
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-center min-h-full p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Kamu belum mendaftar Try Out
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Beli kuota Try Out atau daftar Try Out gratis untuk mulai
                  latihan!
                </p>
                <div className="flex flex-col gap-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                    Beli Kuota Premium
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg"
                  >
                    Daftar Try Out
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Try Out Tersedia Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Try Out Tersedia
            </h2>
            <p className="text-gray-600">Try Out yang bisa kamu ikuti</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTryOuts.slice(0, 6).map((tryOut) => (
              <Card
                key={tryOut.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() => handleStartTryOut(tryOut.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-emerald-500 text-white font-bold text-sm px-3 py-2 rounded min-w-fit">
                      {tryOut.badge}
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {tryOut.number}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {tryOut.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-700 font-medium">
                        Bisa Dibeli
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{tryOut.participants.toLocaleString()} Peserta</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 text-center py-3 border-t border-gray-100">
                    Gratis dan Berbayar
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleViewAllTryOuts}
              variant="outline"
              className="px-8 py-3 rounded-full border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 flex items-center gap-2"
            >
              Jelajahi Try Out Tersedia
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* Materi Pembelajaran Section */}
        <section className="space-y-6 pb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Materi Pembelajaran
              </h2>
              <p className="text-gray-600">Pelajari materi UTBK TPS pilihan</p>
            </div>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 rounded-full px-6 py-2 flex items-center gap-2"
            >
              Lihat Semua
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              return (
                <Card
                  key={subject.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer group"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3 group-hover:scale-105 transition-transform">
                    <div
                      className={`${subject.bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent
                        className={`w-8 h-8 ${subject.color}`}
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                      {subject.name}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPageModule;
