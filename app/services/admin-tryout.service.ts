import { apiClient } from '~/lib/api-client';

export interface SubtestCustomization {
  type: 'PU' | 'PPU' | 'PBM' | 'PK' | 'LBI' | 'LBE' | 'PM';
  duration?: number;
  questionCount?: number;
}

export interface CreateUtbkTryoutRequest {
  name: string;
  year: number;
  publishedAt?: string;
  closedAt?: string;
  isClosed?: boolean;
  subtestCustomizations?: SubtestCustomization[];
}

export interface SubtestInfo {
  id: string;
  name: string;
  type: string;
  kategori: string;
  duration: number;
  questionCount: number;
}

export interface TryoutDetail {
  id: string;
  name: string;
  year: number;
  publishedAt: string;
  closedAt: string;
  isClosed: boolean;
  subtest: SubtestInfo[];
}

export interface CreateUtbkTryoutResponse {
  success: boolean;
  message: string;
  data: TryoutDetail;
}

export const adminTryoutService = {
  createUTBKTryout(data: CreateUtbkTryoutRequest) {
    return apiClient.post<CreateUtbkTryoutResponse>('/admin/tryout/utbk', data);
  },

  getAllTryouts() {
    return apiClient.get<TryoutDetail[]>('/admin/tryout');
  },

  getTryoutById(id: string) {
    return apiClient.get<TryoutDetail>(`/admin/tryout/${id}`);
  },

  updateTryout(id: string, data: Partial<CreateUtbkTryoutRequest>) {
    return apiClient.patch(`/admin/tryout/${id}`, data);
  },

  deleteTryout(id: string) {
    return apiClient.delete(`/admin/tryout/${id}`);
  },
};
