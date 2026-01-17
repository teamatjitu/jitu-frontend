import { createAuthClient } from "better-auth/react";
import { BACKEND_URL } from "./api";

export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
});

export const { signIn, signUp, useSession, signOut } = authClient;
