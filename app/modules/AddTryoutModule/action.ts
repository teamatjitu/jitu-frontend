import { redirect, type ActionFunctionArgs } from "react-router";
import { createTryout } from "~/api/admin";

export async function AddTryoutAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = String(formData.get("title"));
  const publishedAt = String(formData.get("publishedAt"));
  const closedAt = String(formData.get("closedAt"));

  await createTryout({
    name: title,
    publishedAt: new Date(publishedAt).toISOString(),
    closedAt: new Date(closedAt).toISOString(),
  });

  return redirect("/admin");
}
