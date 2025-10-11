import type { LoaderFunctionArgs } from "react-router";

import { Subtest, TipeSoal } from "./enums";

const SAMPLE_TEXT = `Meong ipsum dolor sit amet, consectetur adipiscing elit. Meong felis sit amet felis pulvinar, tincidunt felis meong. Purrr meong curabitur tristique felis vel felis posuere, ac vulputate meong felis vehicula. Sed do meong eiusmod tempor incididunt ut labore et dolore meong magna aliqua.

Ut enim ad minim meong veniam, quis nostrud exercitation meong ullamco laboris nisi ut aliquip ex ea meong commodo consequat. Meong duis aute irure dolor in meong reprehenderit in voluptate velit esse meong cillum dolore eu fugiat nulla meong pariatur.`;

export async function TryOutLoader({ request }: LoaderFunctionArgs) {
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

  const soal1: Soal = {
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
  }

  soal1.opsi.push({
    id: "",
    createdAt: new Date(),
    isCorrect: false,
    soal: soal1,
    soalId: soal1.id,
    teks: "YNTKTS",
    updatedAt: new Date()
  }, {
    id: "",
    createdAt: new Date(),
    isCorrect: false,
    soal: soal1,
    soalId: soal1.id,
    teks: "Mambo",
    updatedAt: new Date()
  }, {
    id: "",
    createdAt: new Date(),
    isCorrect: false,
    soal: soal1,
    soalId: soal1.id,
    teks: "Golshi",
    updatedAt: new Date()
  }, {
    id: "",
    createdAt: new Date(),
    isCorrect: false,
    soal: soal1,
    soalId: soal1.id,
    teks: "ts so tuff",
    updatedAt: new Date()
  });

  tryout.soal.push(soal1);

  tryout.soal.push({
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
  });

  tryout.soal.push({
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
  });

  tryout.soal.push({
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
  });

  tryout.soal.push({
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
  });

  tryout.soal.push({
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
  });

  tryout.soal.push({
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
  });

  tryout.soal.push({
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
  });

  tryout.soal.push({
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
  });

  return { tryout: tryout };
}
