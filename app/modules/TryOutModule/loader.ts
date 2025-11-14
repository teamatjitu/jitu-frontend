import type { LoaderFunctionArgs } from "react-router";

import { Subtest, TipeSoal } from "./enums";

const SAMPLE_TEXT = `Meong ipsum dolor sit amet, consectetur adipiscing elit. Meong felis sit amet felis pulvinar, tincidunt felis meong. Purrr meong curabitur tristique felis vel felis posuere, ac vulputate meong felis vehicula. Sed do meong eiusmod tempor incididunt ut labore et dolore meong magna aliqua.

Ut enim ad minim meong veniam, quis nostrud exercitation meong ullamco laboris nisi ut aliquip ex ea meong commodo consequat. Meong duis aute irure dolor in meong reprehenderit in voluptate velit esse meong cillum dolore eu fugiat nulla meong pariatur.`;

function sampleTryout() {
  const tryout: Tryout = {
    id: "",
    name: "Tryout",
    closedAt: new Date(),
    createdAt: new Date(),
    duration: 30000,
    isClosed: false,
    publishedAt: new Date(),
    soal: [],
    tryoutAttempt: [],
    updatedAt: new Date(),
    year: 2025
  };

  const getSampleOpsi = (soal: Soal): Opsi[] => {
    if (soal.tipeSoal === TipeSoal.ISIAN_SINGKAT) {
      return [];
    }

    if (soal.tipeSoal === TipeSoal.BENAR_SALAH) {
      return [
        {
          id: "",
          createdAt: new Date(),
          isCorrect: true,
          soal: soal,
          soalId: soal.id,
          teks: "Benar",
          updatedAt: new Date()
        }, {
          id: "",
          createdAt: new Date(),
          isCorrect: false,
          soal: soal,
          soalId: soal.id,
          teks: "Salah",
          updatedAt: new Date()
        }
      ];
    }

    return [
      {
        id: "",
        createdAt: new Date(),
        isCorrect: false,
        soal: soal,
        soalId: soal.id,
        teks: "Meong Ipsum A",
        updatedAt: new Date()
      }, {
        id: "",
        createdAt: new Date(),
        isCorrect: false,
        soal: soal,
        soalId: soal.id,
        teks: "Meong Ipsum B",
        updatedAt: new Date()
      }, {
        id: "",
        createdAt: new Date(),
        isCorrect: true,
        soal: soal,
        soalId: soal.id,
        teks: "Meong Ipsum C",
        updatedAt: new Date()
      }, {
        id: "",
        createdAt: new Date(),
        isCorrect: false,
        soal: soal,
        soalId: soal.id,
        teks: "Meong Ipsum D",
        updatedAt: new Date()
      }
    ];
  }

  const soal1: Soal = {
    id: "",
    createdAt: new Date(),
    opsi: [],
    question: SAMPLE_TEXT,
    soalAttempts: [],
    subtestType: Subtest.LBE,
    tipeSoal: TipeSoal.PILIHAN_GANDA,
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date()
  }

  soal1.opsi = getSampleOpsi(soal1);
  tryout.soal.push(soal1);

  const soal2: Soal = {
    id: "",
    createdAt: new Date(),
    opsi: [],
    question: SAMPLE_TEXT,
    soalAttempts: [],
    subtestType: Subtest.LBE,
    tipeSoal: TipeSoal.BENAR_SALAH,
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date()
  };

  soal2.opsi = getSampleOpsi(soal2);
  tryout.soal.push(soal2);

  const soal3: Soal = {
    id: "",
    createdAt: new Date(),
    opsi: [],
    question: SAMPLE_TEXT,
    soalAttempts: [],
    subtestType: Subtest.LBE,
    tipeSoal: TipeSoal.ISIAN_SINGKAT,
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date()
  };

  soal3.opsi = getSampleOpsi(soal3);
  tryout.soal.push(soal3);

  const soal4: Soal = {
    id: "",
    createdAt: new Date(),
    opsi: [],
    question: SAMPLE_TEXT,
    soalAttempts: [],
    subtestType: Subtest.LBE,
    tipeSoal: TipeSoal.PILIHAN_GANDA,
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date()
  };

  soal4.opsi = getSampleOpsi(soal4);
  tryout.soal.push(soal4);

  const soal5: Soal = {
    id: "",
    createdAt: new Date(),
    opsi: [],
    question: SAMPLE_TEXT,
    soalAttempts: [],
    subtestType: Subtest.LBE,
    tipeSoal: TipeSoal.PILIHAN_GANDA,
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date()
  };

  soal5.opsi = getSampleOpsi(soal5);
  tryout.soal.push(soal5);

  const soal6: Soal = {
    id: "",
    createdAt: new Date(),
    opsi: [],
    question: SAMPLE_TEXT,
    soalAttempts: [],
    subtestType: Subtest.LBE,
    tipeSoal: TipeSoal.PILIHAN_GANDA,
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date()
  };

  soal6.opsi = getSampleOpsi(soal6);
  tryout.soal.push(soal6);

  const soal7: Soal = {
    id: "",
    createdAt: new Date(),
    opsi: [],
    question: SAMPLE_TEXT,
    soalAttempts: [],
    subtestType: Subtest.LBE,
    tipeSoal: TipeSoal.ISIAN_SINGKAT,
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date()
  };

  soal7.opsi = getSampleOpsi(soal7);
  tryout.soal.push(soal7);

  const soal8: Soal = {
    id: "",
    createdAt: new Date(),
    opsi: [],
    question: SAMPLE_TEXT,
    soalAttempts: [],
    subtestType: Subtest.LBE,
    tipeSoal: TipeSoal.BENAR_SALAH,
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date()
  };

  soal8.opsi = getSampleOpsi(soal8);
  tryout.soal.push(soal8);

  const soal9: Soal = {
    id: "",
    createdAt: new Date(),
    opsi: [],
    question: SAMPLE_TEXT,
    soalAttempts: [],
    subtestType: Subtest.LBE,
    tipeSoal: TipeSoal.PILIHAN_GANDA,
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date()
  };

  soal9.opsi = getSampleOpsi(soal9);
  tryout.soal.push(soal9);

  return tryout;
}

function sampleTryoutAttempt(tryout: Tryout): TryoutAttempt {
  const tryoutAttempt: TryoutAttempt = {
    id: "",
    accountId: "",
    createdAt: new Date(),
    tryout,
    tryoutId: tryout.id,
    updatedAt: new Date(),
    userId: "",
    soalAttempt: []
  };

  const correctAmount = Math.floor(tryout.soal.length / 2);
  for (let i = 0; i < tryout.soal.length; i++) {
    const soal = tryout.soal[i];
    const isCorrect = i < correctAmount;

    const soalAttempt: SoalAttempt = {
      id: "",
      createdAt: new Date(),
      isCorrect,
      jawaban: 
        isCorrect
          ? soal.tipeSoal === TipeSoal.ISIAN_SINGKAT
            ? "Correct Answer"
            : soal.opsi.find(o => o.isCorrect)?.teks || "Correct Answer"
          : soal.tipeSoal === TipeSoal.ISIAN_SINGKAT
            ? "Wrong Answer"
            : soal.opsi.find(o => !o.isCorrect)?.teks || "Wrong Answer",
      soal,
      soalId: soal.id,
      tryoutAttempt,
      tryoutAttemptId: tryoutAttempt.id,
      updatedAt: new Date()
    };

    tryoutAttempt.soalAttempt.push(soalAttempt);
  }

  return tryoutAttempt;
}

export async function TryOutLoader({ request }: LoaderFunctionArgs) {
  const tryout = sampleTryout();
  const tryoutAttempt = sampleTryoutAttempt(tryout);
  
  tryout.tryoutAttempt.push(tryoutAttempt);

  return { tryout, tryoutAttempt };
}
