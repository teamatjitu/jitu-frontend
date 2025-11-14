import type { LoaderFunctionArgs } from "react-router";
import { tryoutService, type GetSubtestAttemptResponse } from "~/services/tryout.service";

function transformSubtestAttemptResponse(
  response: GetSubtestAttemptResponse
): SubtestAttempt {
  // Create a map of soal for quick lookup
  const soalMap = new Map(
    response.subtest.soal.map((soal) => [
      soal.id,
      {
        id: soal.id,
        tryoutId: soal.tryoutId,
        subtestId: soal.subtestId,
        tipeSoal: soal.tipeSoal,
        question: soal.question,
        createdAt: new Date(soal.createdAt),
        updatedAt: new Date(soal.updatedAt),
        opsi: soal.opsi.map((opsi) => ({
          id: opsi.id,
          soalId: opsi.soalId,
          teks: opsi.teks,
          isCorrect: opsi.isCorrect,
          createdAt: new Date(opsi.createdAt),
          updatedAt: new Date(opsi.updatedAt),
        })),
        pembahasanSoal: soal.pembahasanSoal
          ? {
              id: soal.pembahasanSoal.id,
              soalId: soal.pembahasanSoal.soalId,
              pembahasan: soal.pembahasanSoal.pembahasan,
              createdAt: new Date(soal.pembahasanSoal.createdAt),
              updatedAt: new Date(soal.pembahasanSoal.updatedAt),
            }
          : undefined,
      },
    ])
  );

  return {
    id: response.id,
    attemptId: response.attemptId,
    subtestId: response.subtestId,
    createdAt: new Date(response.createdAt),
    updatedAt: new Date(response.updatedAt),
    startedAt: new Date(response.startedAt),
    finishedAt: response.finishedAt ? new Date(response.finishedAt) : undefined,
    expiresAt: response.expiresAt ? new Date(response.expiresAt) : undefined,
    isFinished: response.isFinished,
    subtest: {
      id: response.subtest.id,
      name: response.subtest.name,
      duration: response.subtest.duration,
      tryoutId: response.subtest.tryoutId,
      createdAt: new Date(response.subtest.createdAt),
      updatedAt: new Date(response.subtest.updatedAt),
      soal: Array.from(soalMap.values()),
    },
    soalAttempt: response.soalAttempt.map((attempt) => ({
      id: attempt.id,
      tryoutAttemptId: attempt.tryoutAttemptId,
      subtestAttemptId: attempt.subtestAttemptId,
      soalId: attempt.soalId,
      jawaban: attempt.jawaban,
      isCorrect: attempt.isCorrect,
      createdAt: new Date(attempt.createdAt),
      updatedAt: new Date(attempt.updatedAt),
      soal: soalMap.get(attempt.soalId)!,
    })),
  };
}

export async function TryOutLoader({ params }: LoaderFunctionArgs) {
  const { subtestAttemptId } = params;

  if (!subtestAttemptId) {
    throw new Error("Subtest attempt ID is required");
  }

  try {
    const response = await tryoutService.getSubtestAttempt(subtestAttemptId);
    const subtestAttempt = transformSubtestAttemptResponse(response);

    return { subtestAttempt };
  } catch (error) {
    console.error("Failed to load subtest attempt:", error);
    throw new Response("Failed to load tryout data", { status: 500 });
  }
}
