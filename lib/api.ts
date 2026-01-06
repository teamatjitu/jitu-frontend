export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export const getTryoutStats = async () => {
  const response = await fetch(`${BACKEND_URL}/admin/stats`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tryout stats");
  }
  return response.json();
};

export const getAllTryouts = async () => {
  const response = await fetch(`${BACKEND_URL}/admin/tryouts`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tryouts");
  }
  return response.json();
};
