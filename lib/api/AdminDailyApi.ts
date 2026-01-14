import { BACKEND_URL } from "../api";

export interface DailyQuestionStats {
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  successRate: number;
}

export interface DailyQuestionResponse {
  id: string;
  content: string;
  type: string;
  points: number;
  explanation?: string;
  subtest: {
    name: string;
    tryOut: { title: string };
  };
  items: any[];
  stats: DailyQuestionStats;
}

export const getTodayDailyQuestion = async (): Promise<DailyQuestionResponse | null> => {
  const response = await fetch(`${BACKEND_URL}/admin/daily/today`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Failed to fetch today's daily question");
  }
  return response.json();
};
