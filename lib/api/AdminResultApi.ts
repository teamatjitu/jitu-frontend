import { BACKEND_URL } from "../api";

export interface LeaderboardEntry {
  rank: number;
  totalScore: number;
  user: {
    name: string;
    email: string;
    image?: string;
    target?: string;
  };
}

export interface TryoutStats {
  title: string;
  totalParticipants: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  distribution: {
    under400: number;
    range400to600: number;
    range600to800: number;
    above800: number;
  };
}

export const getLeaderboard = async (tryoutId: string, page = 1, limit = 50) => {
  const response = await fetch(
    `${BACKEND_URL}/admin/tryouts/${tryoutId}/leaderboard?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return response.json();
};

export const getTryoutStats = async (tryoutId: string): Promise<TryoutStats> => {
  const response = await fetch(`${BACKEND_URL}/admin/tryouts/${tryoutId}/stats`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tryout stats");
  }
  return response.json();
};

export const exportResults = async (tryoutId: string) => {
  const response = await fetch(`${BACKEND_URL}/admin/tryouts/${tryoutId}/export`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to export results");
  }
  return response.json();
};
