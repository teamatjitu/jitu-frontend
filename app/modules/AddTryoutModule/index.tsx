"use client";
import { useState } from "react";

import { QuestionNumbersMenu } from "./components/QuestionNumbersMenu";

const subtests = [
  {
    judul: "Penalaran Umum",
    soal: 30,
  },
  {
    judul: "Pemahaman Bacaan dan Menulis",
    soal: 30,
  },
  {
    judul: "Pengetahuan dan Pemahaman Umum",
    soal: 30,
  },
  {
    judul: "Pengetahuan Kuantitatif",
    soal: 30,
  },
  {
    judul: "Literasi Bahasa Indonesia",
    soal: 30,
  },
  {
    judul: "Literasi Bahasa Inggris",
    soal: 30,
  },
  {
    judul: "Penalaran Matematika",
    soal: 30,
  },
];

export const AddTryoutModule = () => {
  const [isActiveMenu, setActiveMenu] = useState<number | null>(null);
  return (
    <main className="min-h-screen mt-8 gap-44 flex flex-wrap justify-center">
      {subtests.map((s, i) => (
        <QuestionNumbersMenu
          isActive={isActiveMenu === i}
          onClickMenu={() => setActiveMenu(i)}
          judul={s.judul}
          soal={s.soal}
          key={i}
        />
      ))}
    </main>
  );
};
