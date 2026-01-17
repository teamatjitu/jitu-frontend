import { createAuthClient } from "better-auth/react";

// Point to self (Vercel) so that requests go through the Next.js Proxy
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:5173",
});

<<<<<<< HEAD
export const { 
  signIn, 
  signUp, 
  useSession, 
  signOut, 
  changePassword,
  requestPasswordReset,
  resetPassword
=======
export const {
  signIn,
  signUp,
  useSession,
  signOut,
  changePassword,
  requestPasswordReset,
  resetPassword,
>>>>>>> 3ee9ef9 (fix: profile page edit and reset features)
} = authClient;
