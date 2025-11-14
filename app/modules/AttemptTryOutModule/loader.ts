import type { LoaderFunctionArgs } from "react-router";
import { tryoutService, type GetSubtestAttemptResponse } from "~/services/tryout.service";

function transformSubtestAttemptResponse(
  response: GetSubtestAttemptResponse
): SubtestAttempt {
  // Step 1: Transform Opsi (no dependencies)
  const transformOpsi = (opsi: any): Opsi => ({
    id: opsi.id,
    soalId: opsi.soalId,
    teks: opsi.teks,
    isCorrect: opsi.isCorrect,
    createdAt: new Date(opsi.createdAt),
    updatedAt: new Date(opsi.updatedAt),
  });

  // Step 2: Transform PembahasanSoal (no dependencies)
  const transformPembahasan = (pembahasan: any): PembahasanSoal => ({
    id: pembahasan.id,
    soalId: pembahasan.soalId,
    pembahasan: pembahasan.pembahasan,
    createdAt: new Date(pembahasan.createdAt),
    updatedAt: new Date(pembahasan.updatedAt),
  });

  // Step 3: Transform Soal (depends on Opsi and PembahasanSoal)
  const transformSoal = (soal: any): Soal => ({
    id: soal.id,
    tryoutId: soal.tryoutId,
    subtestId: soal.subtestId,
    tipeSoal: soal.tipeSoal,
    question: soal.question,
    createdAt: new Date(soal.createdAt),
    updatedAt: new Date(soal.updatedAt),
    opsi: soal.opsi.map(transformOpsi),
    pembahasanSoal: soal.pembahasanSoal
      ? transformPembahasan(soal.pembahasanSoal)
      : undefined,
  });

  // Step 4: Transform all Soal to create lookup map
  const soalMap = new Map<string, Soal>();
  response.subtest.soal.forEach((soal) => {
    soalMap.set(soal.id, transformSoal(soal));
  });

  // Step 5: Transform Subtest (depends on Soal)
  const subtest: Subtest = {
    id: response.subtest.id,
    name: response.subtest.name,
    duration: response.subtest.duration,
    tryoutId: response.subtest.tryoutId,
    createdAt: new Date(response.subtest.createdAt),
    updatedAt: new Date(response.subtest.updatedAt),
    soal: Array.from(soalMap.values()),
  };

  // Step 6: Transform SoalAttempt (depends on Soal from map)
  const soalAttempts: SoalAttempt[] = response.soalAttempt.map((attempt) => ({
    id: attempt.id,
    tryoutAttemptId: attempt.tryoutAttemptId,
    subtestAttemptId: attempt.subtestAttemptId,
    soalId: attempt.soalId,
    jawaban: attempt.jawaban,
    isCorrect: attempt.isCorrect,
    createdAt: new Date(attempt.createdAt),
    updatedAt: new Date(attempt.updatedAt),
    soal: soalMap.get(attempt.soalId)!,
  }));

  // Step 7: Build final SubtestAttempt
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
    subtest,
    soalAttempt: soalAttempts,
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
