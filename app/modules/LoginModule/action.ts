import { error } from "console";
import { redirect, type ActionFunctionArgs } from "react-router";

import { authClient } from "~/lib/auth-client";

export async function LoginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form data" };
  }

  try {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return { error: error.message };
    } else {
      console.log("Login successful:", data);
      return redirect("/profile");
    }
  } catch (e) {
    console.error("An unexpected error occurred:", e);
    return { error: "Something Error" };
  }
}
