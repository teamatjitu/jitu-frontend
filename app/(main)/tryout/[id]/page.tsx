import TryoutDetailModule from "@/modules/TryoutDetailModule";
import { getTryoutDetail } from "@/modules/TryoutDetailModule/payload";
import { notFound } from "next/navigation";

export default async function TryoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tryoutId = parseInt(id);
  const tryoutData = getTryoutDetail(tryoutId);

  if (!tryoutData) {
    notFound();
  }

  return <TryoutDetailModule tryoutId={tryoutId} tryoutData={tryoutData} />;
}
