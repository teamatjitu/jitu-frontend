import type { ActionFunctionArgs } from "react-router";
import { authClient } from "~/lib/auth-client";

export async function LandingAction({ request }: ActionFunctionArgs) {
  try {
    const { data, error } = await authClient.signOut();

    if (error) {
      console.error("Sign Out error:", error);
      return { error: error.message };
    } else {
      console.log("Sign Out successful:", data);
      return { success: true, data };
    }
  } catch (e) {
    console.error("An unexpected error occurred:", e);
    return { error: "An unexpected error occurred during sign out." };
  }
}
