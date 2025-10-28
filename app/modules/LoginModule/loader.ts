import { redirect, type LoaderFunctionArgs } from "react-router";
import { authClient } from "~/lib/auth-client";

export async function LoginLoader({ request }: LoaderFunctionArgs) {
  const session = await authClient.getSession();
  console.log(session);

  if (session.data) {
    return redirect("/profile");
  }

  return null;
}
