import { type LoaderFunctionArgs } from "react-router";
import { getTryoutById } from "~/api/admin";

export async function EditTryoutLoader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) throw new Error("Tryout ID is required");

  try {
    const tryout = await getTryoutById(id);
    return tryout;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
