import SubtestQuestionsModule from "@/modules/SubtestQuestionsModule";

export default async function SubtestQuestionsPage({
  params,
}: {
  params: Promise<{ id: string; subtestId: string }>;
}) {
  const { id, subtestId } = await params;

  return <SubtestQuestionsModule subtestId={subtestId} tryoutId={id} />;
}
