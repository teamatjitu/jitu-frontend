import type { Tryout } from "~/modules/AdminModule/type";
type TryoutUpdate = Partial<Tryout>;

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
