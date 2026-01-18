import TryoutExamModule from "@/modules/TryoutExamModule";
import { getSubtestExam } from "@/modules/TryoutExamModule/payload";
import { notFound } from "next/navigation";

export default async function TryoutExamPage({
  params,
}: {
  params: Promise<{ id: string; subtestId: string }>;
}) {
  const { id, subtestId } = await params;
  const tryoutId = parseInt(id);
  const subtestIdNum = parseInt(subtestId);

  const examData = getSubtestExam(tryoutId, subtestIdNum);

  if (!examData) {
    notFound();
  }

  return <TryoutExamModule examData={examData} />;
}
