import { error } from "console";
import { redirect, type ActionFunctionArgs } from "react-router";

import { authClient } from "~/lib/auth-client";

export async function RegisterAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmedPassword = formData.get("confirmedPassword");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: "Invalid form data" };
  }

  if (password !== confirmedPassword) {
    return { error: "Password don't match" };
  }

  try {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      console.error("Registration error:", error);
      return { error: error.message };
    } else {
      console.log("Registration successful:", data);
      return redirect("/login");
    }
  } catch (e) {
    console.error("An unexpected error occurred:", e);
    return { error: "An unexpected error occurred during registration." };
  }
}
