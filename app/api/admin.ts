const API_BASE = `${process.env.BACKEND_URL}/admin/tryout`;
import type { Tryout } from "~/modules/AdminModule/type";

export const getTryout = async () => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch tryouts");
  return res.json();
};

export const getTryoutById = async (id: string) => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch tryouts, ${res.status}`);
  return res.json();
};

export const updateTryout = async (id: string, data: Tryout) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update tryout");
  return res.json();
};
