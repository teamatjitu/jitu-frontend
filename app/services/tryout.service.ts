import { apiClient } from '~/lib/api-client';

export interface StartTryoutResponse {
  id: string;
  userId: string;
  tryoutId: string;
  accountId: string;
  startedAt: string;
  isFinished: boolean;
}

export interface StartSubtestResponse {
  id: string;
  attemptId: string;
  subtestId: string;
  startedAt: string;
  expiresAt: string;
  isFinished: boolean;
}

export interface GetSubtestQuestionsResponse {
  id: string;
  name: string;
  duration: number;
  tryoutId: string;
  createdAt: string;
  updatedAt: string;
  soal: Array<{
    id: string;
    tryoutId: string;
    subtestId: string;
    tipeSoal: string;
    question: string;
    createdAt: string;
    updatedAt: string;
    opsi: Array<{
      id: string;
      teks: string;
    }>;
  }>;
}

export interface SubmitAnswerRequest {
  soalId: string;
  jawaban: string;
}

export interface RemainingTimeResponse {
  remainingTime: number;
}

export interface FinishSubtestResponse {
  success: boolean;
  message: string;
}

export interface GetSubtestAttemptResponse {
  id: string;
  attemptId: string;
  subtestId: string;
  createdAt: string;
  updatedAt: string;
  startedAt: string;
  finishedAt?: string;
  expiresAt?: string;
  isFinished: boolean;
  subtest: {
    id: string;
    name: string;
    duration: number;
    tryoutId: string;
    createdAt: string;
    updatedAt: string;
    soal: Array<{
      id: string;
      tryoutId: string;
      subtestId: string;
      tipeSoal: string;
      question: string;
      createdAt: string;
      updatedAt: string;
      opsi: Array<{
        id: string;
        soalId: string;
        teks: string;
        isCorrect: boolean;
        createdAt: string;
        updatedAt: string;
      }>;
      pembahasanSoal?: {
        id: string;
        soalId: string;
        pembahasan: string;
        createdAt: string;
        updatedAt: string;
      };
    }>;
  };
  soalAttempt: Array<{
    id: string;
    tryoutAttemptId: string;
    subtestAttemptId: string;
    soalId: string;
    jawaban?: string;
    isCorrect?: boolean;
    createdAt: string;
    updatedAt: string;
    soal: {
      id: string;
      tryoutId: string;
      subtestId: string;
      tipeSoal: string;
      question: string;
      createdAt: string;
      updatedAt: string;
    };
  }>;
}

export interface CreateTryoutRequest {
  name: string;
  year: number;
  publishedAt?: string;
  closedAt?: string;
  isClosed?: boolean;
}

export interface SubtestInfo {
  id: string;
  name: string;
  type: string;
  kategori: string;
  duration: number;
  _count?: {
    soal: number;
  };
}

export interface TryoutListItem {
  id: string;
  name: string;
  year: number;
  publishedAt: string;
  closedAt: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  subtest: SubtestInfo[];
  _count: {
    tryoutAttempt: number;
    soal: number;
  };
}

export interface GetAllTryoutsResponse {
  data: TryoutListItem[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface TryoutDetailsResponse {
  id: string;
  name: string;
  year: number;
  publishedAt: string;
  closedAt: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  subtest: SubtestInfo[];
  subtestByCategory: {
    TES_POTENSI_SKOLASTIK: SubtestInfo[];
    TES_LITERASI_BAHASA: SubtestInfo[];
    PENALARAN_MATEMATIKA: SubtestInfo[];
  };
  _count: {
    tryoutAttempt: number;
    soal: number;
  };
}

export const tryoutService = {
  startTryout(tryoutId: string) {
    return apiClient.post<StartTryoutResponse>(
      `/tryouts/${tryoutId}/start`
    );
  },

  startSubtest(tryoutAttemptId: string, subtestId: string) {
    return apiClient.post<StartSubtestResponse>(
      `/tryouts/${tryoutAttemptId}/${subtestId}/start`
    );
  },

  getSubtestQuestions(subtestAttemptId: string) {
    return apiClient.get<GetSubtestQuestionsResponse>(
      `/tryouts/subtest/attempt/${subtestAttemptId}`
    );
  },

  submitAnswer(
    tryoutAttemptId: string,
    subtestAttemptId: string,
    data: SubmitAnswerRequest
  ) {
    return apiClient.post(
      `/tryouts/attempt/${tryoutAttemptId}/${subtestAttemptId}/answer`,
      data
    );
  },

  getRemainingTime(subtestAttemptId: string) {
    return apiClient.get<RemainingTimeResponse>(
      `/tryouts/subtest/attempt/${subtestAttemptId}/remaining-time`
    );
  },

  finishSubtest(subtestAttemptId: string) {
    return apiClient.post<FinishSubtestResponse>(
      `/tryouts/subtest/attempt/${subtestAttemptId}/finish`
    );
  },

  finishTryout(tryoutAttemptId: string) {
    return apiClient.post<FinishSubtestResponse>(
      `/tryouts/attempt/${tryoutAttemptId}/finish`
    );
  },

  // This would be a custom endpoint to get subtest attempt with all related data
  getSubtestAttempt(subtestAttemptId: string) {
    return apiClient.get<GetSubtestAttemptResponse>(
      `/tryouts/subtest/attempt/${subtestAttemptId}/details`
    );
  },

  getAllTryouts(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    return apiClient.get<GetAllTryoutsResponse>(
      `/tryouts?${searchParams.toString()}`
    );
  },

  getTryoutDetails(tryoutId: string) {
    return apiClient.get<TryoutDetailsResponse>(`/tryouts/${tryoutId}`);
  },
};
