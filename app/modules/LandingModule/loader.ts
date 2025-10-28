import type { LoaderFunctionArgs } from "react-router";
import { authClient } from "~/lib/auth-client";
import { redirect } from "react-router";

export async function LandingLoader({ request }: LoaderFunctionArgs) {
  const session = await authClient.getSession();
  console.log(session);

  if (!session.data) {
    return redirect("/login");
  }

  return null;
}
