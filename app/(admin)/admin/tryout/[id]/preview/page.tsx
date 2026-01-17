import AdminTryoutPreviewModule from "@/modules/AdminTryoutPreviewModule";

export default async function AdminTryoutPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AdminTryoutPreviewModule tryoutId={id} />;
}
