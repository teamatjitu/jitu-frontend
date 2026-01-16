import AdminTryoutResultModule from "@/modules/AdminTryoutResultModule";

export default async function AdminTryoutResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminTryoutResultModule tryoutId={id} />;
}
