const BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:5173";

export const BACKEND_URL = `${BASE_URL}/api/proxy`;

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
