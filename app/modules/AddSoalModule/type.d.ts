export interface Tryout {
  id: string;
  name: string;
  year: number;
  duration: number;
  publishedAt: Date;
  closedAt: Date;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;

  soal: Soal[];
  tryoutAttempt: TryoutAttempt[];
}

export interface Soal {
  id: string;
  tryoutId: string;
  subtestId: string;
  tipeSoal: string; // "PILIHAN_GANDA" | "ISIAN_SINGKAT" | "BENAR_SALAH"
  question: string;
  createdAt: string;
  updatedAt: string;
  opsi: Opsi[];
  pembahasanSoal?: PembahasanSoal;
}

export interface Opsi {
  id: string;
  soalId: string;
  teks: string;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PembahasanSoal {
  id: string;
  soalId: string;
  pembahasan: string;
  createdAt: string;
  updatedAt: string;
}

export interface TryoutAttempt {
  id: string;
  userId: string;
  // user: User;
  tryoutId: string;
  tryout: Tryout;
  createdAt: Date;
  updatedAt: Date;

  accountId: string;
  // account: Account;

  soalAttempt: SoalAttempt[];
}

interface SoalAttempt {
  id: string;
  tryoutAttemptId: string;
  tryoutAttempt: TryoutAttempt;
  soalId: string;
  soal: Soal;
  jawaban?: string;
  isCorrect?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubtestInfo {
  id: string;
  name: string;
  type: string;
  kategori: string;
  duration: number;
  questionCount: number;
}

export interface GetSoalBySubtestResponse {
  subtest: SubtestInfo;
  soal: Soal[];
  total: number;
}
