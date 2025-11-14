interface Subtest {
  id: string;
  name: string;
  duration: number;
  tryoutId: string;
  createdAt: Date;
  updatedAt: Date;
  soal: Soal[];
}

interface Tryout {
  id: string;
  name: string;
  year: number;
  publishedAt: Date;
  closedAt: Date;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
  subtest: Subtest[];
}

interface Opsi {
  id: string;
  soalId: string;
  teks: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PembahasanSoal {
  id: string;
  soalId: string;
  pembahasan: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Soal {
  id: string;
  tryoutId: string;
  subtestId: string;
  tipeSoal: string; // "PILIHAN_GANDA" | "ISIAN_SINGKAT" | "BENAR_SALAH"
  question: string;
  createdAt: Date;
  updatedAt: Date;
  opsi: Opsi[];
  pembahasanSoal?: PembahasanSoal;
}

interface SoalAttempt {
  id: string;
  tryoutAttemptId: string;
  subtestAttemptId: string;
  soalId: string;
  jawaban?: string;
  isCorrect?: boolean;
  createdAt: Date;
  updatedAt: Date;
  soal: Soal;
}

interface SubtestAttempt {
  id: string;
  attemptId: string;
  subtestId: string;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date;
  finishedAt?: Date;
  expiresAt?: Date;
  isFinished: boolean;
  subtest: Subtest;
  soalAttempt: SoalAttempt[];
}

interface TryoutAttempt {
  id: string;
  userId: string;
  tryoutId: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
  rawScore?: number;
  scaledScore?: number;
  isFinished: boolean;
  startedAt: Date;
  finishedAt?: Date;
  tryout: Tryout;
  subtestAttempt: SubtestAttempt[];
  soalAttempt: SoalAttempt[];
}
