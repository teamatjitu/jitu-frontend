import { BACKEND_URL } from "@/lib/api";
import { TryoutDetail } from "@/modules/TryoutDetailModule/interface";

export type LeaderboardItem = {
  rank: number;
  name: string;
  score: number;
  isCurrentUser: boolean;
};

export type LeaderboardData = {
  top10: LeaderboardItem[];
  currentUserRank: LeaderboardItem | null;
};

export const getTryoutDetail = async (
  tryoutId: string,
): Promise<TryoutDetail> => {
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
    latestAttemptId: data.latestAttemptId ?? null,
    currentSubtestOrder: data.currentSubtestOrder ?? 1,
    latestScore: data.latestScore ?? 0,
  };

  return mappedData;
};

export const getTryoutLeaderboard = async (
  tryoutId: string,
): Promise<LeaderboardData> => {
  const res = await fetch(`${BACKEND_URL}/tryout/${tryoutId}/leaderboard`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("Terjadi kesalahan");
    }
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Gagal mengambil data leaderboard");
  }

  return res.json();
};
