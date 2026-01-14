import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
  socialProviderStrategy: "unyt", // Or standard redirect if popup is not explicitly handled by a flag in this version
});

export const { signIn, signUp, useSession, signOut } = authClient;
