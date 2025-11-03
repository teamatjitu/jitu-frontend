import { type LoaderFunctionArgs } from "react-router";
import { getTryout } from "~/api/admin";

export async function AdminLoader({ request }: LoaderFunctionArgs) {
  const tryouts = await getTryout();
  return tryouts;
}
