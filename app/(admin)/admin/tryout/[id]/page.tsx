import EditTryoutModule from "@/modules/EditTryoutModule";

export default async function EditTryoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditTryoutModule tryoutId={id} />;
}
