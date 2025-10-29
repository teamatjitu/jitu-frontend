const API_BASE = `${process.env.BACKEND_URL}/admin/tryout`;

export const getTryout = async () => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch tryouts");
  return res.json();
};
