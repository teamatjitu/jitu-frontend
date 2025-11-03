interface Tryout {
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

interface Soal {
  id: string;
  tryoutId: string;
  tryout: Tryout;
  subtestType: Subtest;
  tipeSoal: TipeSoal;
  question: string;
  createdAt: Date;
  updatedAt: Date;

  opsi: Opsi[];
  pembahasanSoal?: PembahasanSoal;
  soalAttempts: SoalAttempt[];
}

interface Opsi {
  id: string;
  soalId: string;
  soal: Soal;
  teks: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PembahasanSoal {
  id: string;
  soalId: string;
  soal: Soal;
  pembahasan: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TryoutAttempt {
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
