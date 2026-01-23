"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, changePassword, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  User,
  LogOut,
  TrendingUp,
  History,
  Award,
  Coins,
  Flame,
  Settings,
  Edit3,
  Shield,
  BookOpen,
  Target,
  Lock,
  KeyRound,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { BACKEND_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";

// --- Tipe Data (Interface) ---
interface Attempt {
  id: string;
  title: string;
  date: string;
  score: number;
  status: string;
}

interface ProfileStats {
  totalTryout: number;
  averageScore: number;
  lastScore: number;
  streak: number;
}

export default function ProfileModule() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // -- State Tabs --
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "settings"
  >("overview");

  // -- State Data --
  const [stats, setStats] = useState<ProfileStats>({
    lastScore: 0,
    averageScore: 0,
    streak: 0,
    totalTryout: 0,
  });
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // -- State Edit Profile --
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", target: "" });

  // -- State Password --
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Cek apakah user punya password (jika login Google biasanya false)
  // Better Auth biasanya tidak mengekspos `hasPassword` secara langsung di session user standard,
  // tapi kita bisa asumsikan dari `auth.providers`.
  // Untuk simplifikasi, kita anggap semua user punya akses set password.
  // Tapi sebaiknya check session.user.hasPassword jika available di schema Anda.
  const hasPassword = (session?.user as any)?.hasPassword ?? false;

  // -- 1. Fetch Data Tambahan (Client Side Proxy) --
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session) return;
      setIsLoadingData(true);
      try {
        const res = await fetch(`${BACKEND_URL}/profile`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
          if (data.attempts) setAttempts(data.attempts);

          // Update local form data
          setFormData({
            name: session.user.name || "",
            target: (session.user as any).target || "",
          });
        }
      } catch (error) {
        console.error("Gagal memuat data profile:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchProfileData();
  }, [session]);

  // -- 2. Logic Auth --
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    if (typeof window !== "undefined") router.replace("/login");
    return null;
  }

  const user = {
    name: session.user?.name || "Siswa Jitu",
    email: session.user?.email || "",
    image: session.user?.image || null,
    target: (session.user as any).target || "-",
    tokenBalance: (session.user as any).tokenBalance || 0,
  };

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Berhasil keluar akun");
          router.replace("/login");
        },
      },
    });
  };

  // -- 3. Handler Edit Profile --
  const openEditModal = () => {
    setFormData({
      name: user.name,
      target: user.target === "-" ? "" : user.target,
    });
    setIsEditOpen(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${BACKEND_URL}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan profil");

      toast.success("Profil berhasil diperbarui!");
      setIsEditOpen(false);

      // Refresh halaman agar session terupdate (atau update session manual jika didukung)
      router.refresh();
      // Workaround: Force reload to update session cookie immediately
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  // -- 4. Handler Password --
  const resetPasswordModal = () => {
    setIsPasswordOpen(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePasswordAction = async () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Password baru wajib diisi");
      return;
    }
    if (hasPassword && !passwordForm.currentPassword) {
      toast.error("Password saat ini wajib diisi");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Password baru tidak cocok");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Minimal 8 karakter");
      return;
    }

    setIsPasswordSaving(true);
    try {
      if (hasPassword) {
        await changePassword(
          {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
            revokeOtherSessions: true,
          },
          {
            onSuccess: () => {
              toast.success("Password berhasil diubah!");
              resetPasswordModal();
            },
            onError: (ctx) => {
              toast.error(ctx.error.message);
            },
          },
        );
      } else {
        const res = await fetch(`${BACKEND_URL}/profile/set-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: passwordForm.newPassword }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Gagal membuat password");
        }

        toast.success("Password berhasil dibuat! Silakan login ulang.");
        resetPasswordModal();
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan sistem");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans text-slate-900">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-8 md:flex md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-slate-50 shadow-sm overflow-hidden bg-slate-100 relative">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    className="object-cover rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-slate-400">
                    <User size={40} />
                  </div>
                )}
              </div>
              <button
                onClick={openEditModal}
                className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <Edit3 size={14} />
              </button>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-slate-500 text-sm mb-2">{user.email}</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                >
                  Member Siswa
                </Badge>
                <Badge
                  variant="outline"
                  className="text-slate-600 border-slate-200 gap-1"
                >
                  <Target size={12} />
                  {(session.user as any).target}
                </Badge>
                <div
                  onClick={() => router.push("/shop")}
                  className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
                >
                  <Coins size={12} className="fill-amber-500 text-amber-500" />
                  {user.tokenBalance} Token
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => router.push("/shop")}>
              <Coins className="mr-2 h-4 w-4 text-amber-500" />
              Isi Token
            </Button>
            <Button onClick={() => router.push("/tryout")}>
              Mulai Tryout Baru
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SIDEBAR MENU */}
        <div className="lg:col-span-3 space-y-6">
          <nav className="flex flex-col space-y-1">
            <MenuButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={BookOpen}
              label="Ringkasan"
            />
            <MenuButton
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              icon={History}
              label="Riwayat Tryout"
            />
            <MenuButton
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
              icon={Settings}
              label="Pengaturan"
            />
          </nav>

          <Card className="bg-slate-50 border-dashed border-slate-200 shadow-none">
            <CardContent className="p-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Lainnya
              </h4>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-white h-9 px-2"
                  onClick={() =>
                    window.open("https://wa.me/628123456789", "_blank")
                  }
                >
                  <Shield className="mr-2 h-4 w-4 text-slate-400" />
                  Hubungi Admin
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 h-9 px-2"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar Akun
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CONTENT */}
        <div className="lg:col-span-9 space-y-6">
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  title="Skor Terakhir"
                  value={stats.lastScore}
                  icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
                  trend="Update real-time"
                />
                <StatCard
                  title="Rata-rata"
                  value={stats.averageScore}
                  icon={<Award className="h-5 w-5 text-purple-600" />}
                  trend="Dari semua TO"
                />
                <StatCard
                  title="Total Tryout"
                  value={stats.totalTryout}
                  icon={<Flame className="h-5 w-5 text-orange-600" />}
                  trend="Terus tingkatkan!"
                />
              </div>

              {stats.totalTryout === 0 && (
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        Belum ada riwayat belajar?
                      </h3>
                      <p className="text-blue-100 text-sm">
                        Yuk kerjakan Tryout pertamamu untuk mengukur kemampuan!
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => router.push("/tryout")}
                      className="whitespace-nowrap"
                    >
                      Coba Tryout Gratis
                    </Button>
                  </div>
                </div>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-bold">
                    Aktivitas Terakhir
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("history")}
                    className="text-xs"
                  >
                    Lihat Semua <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {attempts.length > 0 ? (
                    <div className="space-y-4">
                      {attempts.slice(0, 3).map((attempt) => (
                        <HistoryItem key={attempt.id} attempt={attempt} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      {isLoadingData
                        ? "Memuat data..."
                        : "Belum ada aktivitas."}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "history" && (
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pengerjaan</CardTitle>
              </CardHeader>
              <CardContent>
                {attempts.length > 0 ? (
                  <div className="space-y-0 divide-y divide-slate-100">
                    {attempts.map((attempt) => (
                      <HistoryItem key={attempt.id} attempt={attempt} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                      <History className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900">
                      Belum Ada Riwayat
                    </h3>
                    <p className="text-slate-500 text-sm max-w-xs mt-1 mb-4">
                      Kamu belum mengerjakan tryout apapun. Mulai sekarang untuk
                      melihat progresmu.
                    </p>
                    <Button onClick={() => router.push("/tryout")}>
                      Mulai Tryout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Informasi Profil</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openEditModal}
                      className="h-8"
                    >
                      <Edit3 className="w-3 h-3 mr-2" /> Edit Data
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-700">
                        Nama Lengkap
                      </label>
                      <div className="p-2 border rounded-md bg-slate-50 text-slate-600 text-sm">
                        {user.name}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-700">
                        Target Kampus
                      </label>
                      <div className="p-2 border rounded-md bg-slate-50 text-slate-600 text-sm">
                        {user.target}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">
                      Email Terdaftar
                    </label>
                    <div className="p-2 border rounded-md bg-slate-50 text-slate-500 text-sm flex items-center justify-between">
                      {user.email}
                      <Badge
                        variant="outline"
                        className="text-green-600 bg-green-50 border-green-200"
                      >
                        Terverifikasi
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Keamanan
                  </h4>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-slate-600 hover:text-slate-900"
                    onClick={() => setIsPasswordOpen(true)}
                  >
                    {hasPassword ? (
                      <Lock className="w-4 h-4 mr-2" />
                    ) : (
                      <KeyRound className="w-4 h-4 mr-2" />
                    )}
                    {hasPassword ? "Ubah Password" : "Buat Password Akun"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* --- Dialog Edit Profile --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profil</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nama Lengkap
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="target" className="text-sm font-medium">
                Target Kampus/Jurusan
              </label>
              <Input
                id="target"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })
                }
                placeholder="Contoh: Kedokteran UI 2026"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Batal
              </Button>
            </DialogClose>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Dialog Password --- */}
      <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {hasPassword ? "Ubah Password" : "Buat Password Baru"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {hasPassword && (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Password Saat Ini</label>
                <Input
                  type="password"
                  placeholder="******"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="grid gap-2">
              <label className="text-sm font-medium">Password Baru</label>
              <Input
                type="password"
                placeholder="Minimal 8 karakter"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Konfirmasi Password Baru
              </label>
              <Input
                type="password"
                placeholder="Ulangi password baru"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            {!hasPassword && (
              <p className="text-xs text-slate-500 bg-blue-50 p-2 rounded border border-blue-100">
                Karena Anda login menggunakan Google/Akun lain, Anda belum
                memiliki password. Buat password sekarang agar bisa login
                menggunakan Email & Password.
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Batal
              </Button>
            </DialogClose>
            <Button onClick={handlePasswordAction} disabled={isPasswordSaving}>
              {isPasswordSaving
                ? "Menyimpan..."
                : hasPassword
                  ? "Simpan Password"
                  : "Buat Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Sub-Components ---

function MenuButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
        active
          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200"
          : "text-slate-600 hover:bg-white hover:text-slate-900"
      }`}
    >
      <Icon
        className={`h-4 w-4 ${active ? "text-blue-600" : "text-slate-400"}`}
      />
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-500">{title}</span>
          <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        </div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <p className="text-xs text-slate-400 mt-1">{trend}</p>
      </CardContent>
    </Card>
  );
}

function HistoryItem({ attempt }: { attempt: Attempt }) {
  const dateStr = new Date(attempt.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
      <div>
        <h4 className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
          {attempt.title}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">{dateStr}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-slate-900">{attempt.score}</div>
        <span
          className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
            attempt.score >= 700
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {attempt.status}
        </span>
      </div>
    </div>
  );
}
