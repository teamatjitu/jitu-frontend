import type { Tryout } from "~/modules/AdminModule/type";

type TryoutUpdate = Partial<Tryout>;
type TryoutCreate = {
  name: string;
  publishedAt: string;
  closedAt: string;
};

type OpsiCreate = {
  teks: string;
  isCorrect: boolean;
};

type PembahasanCreate = {
  pembahasan: string;
};

type SoalCreate = {
  tryoutId: string;
  subtestType: string;
  tipeSoal: string;
  question: string;

  opsi?: OpsiCreate[];
  pembahasanSoal?: PembahasanCreate;
};

export const getTryout = async () => {
  const res = await fetch(`${process.env.BACKEND_URL}/admin/tryout`);
  if (!res.ok) throw new Error("Failed to fetch tryouts");
  return res.json();
};

export const getTryoutById = async (id: string) => {
  const res = await fetch(`${`${process.env.BACKEND_URL}/admin/tryout`}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch tryouts, ${res.status}`);
  return res.json();
};

export const updateTryout = async (id: string, data: TryoutUpdate) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/admin/tryout/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (!res.ok) {
    if (json?.message) json.message;
  }

  return json;
};

export const createTryout = async (data: TryoutCreate) => {
  const res = await fetch(`${process.env.BACKEND_URL}/admin/tryout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    if (json?.message) json.message;
  }

  return json;
};

export const createSoal = async (data: SoalCreate) => {
  const res = await fetch(`${process.env.BACKEND_URL}/admin/soal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) {
    if (json?.message) json.message;
  }

  return json;
};

export const getSoalByTryoutAndSubtest = async (
  tryoutId: string,
  subtestType: string
) => {
  const res = await fetch(
    `${process.env.BACKEND_URL}/admin/soal/tryout/${tryoutId}/subtest/${subtestType}`
  );
  if (!res.ok) throw new Error("Failed to fetch soal");
  return res.json();
};
