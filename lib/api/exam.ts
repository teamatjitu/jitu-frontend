import { BACKEND_URL } from "@/lib/api";

export const startTryoutAttempt = async (
  tryoutId: string,
  userId: string,
): Promise<string> => {
  const res = await fetch(`${BACKEND_URL}/exam/${tryoutId}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Gagal memulai attempt");
  }

  const data = await res.json();
  const id = data?.attemptId || data?.id;

  if (!id) {
    throw new Error(
      "Attempt berhasil dibuat, tapi attemptId tidak ditemukan di response.",
    );
  }

  return String(id);
};

export const registerTryout = async (tryoutId: string) => {
  const res = await fetch(`${BACKEND_URL}/tryout/${tryoutId}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mendaftar tryout");
  }

  return data;
};
