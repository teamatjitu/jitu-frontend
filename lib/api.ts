const IS_PROD = process.env.NODE_ENV === "production";
const BASE_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:5173";

// In production, we use the Vercel proxy to avoid cross-domain cookie issues.
export const BACKEND_URL = IS_PROD
  ? `${BASE_URL}/api/proxy`
  : process.env.NEXT_PUBLIC_BACKEND_URL;

export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
