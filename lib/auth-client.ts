import { createAuthClient } from "better-auth/react";
import { FRONTEND_URL } from "./api";

export const authClient = createAuthClient({
  baseURL: FRONTEND_URL,
});

export const { signIn, signUp, useSession, signOut } = authClient;
