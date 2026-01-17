import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
});

// Hapus 'setPassword' dari sini
export const { signIn, signUp, useSession, signOut, changePassword } = authClient;