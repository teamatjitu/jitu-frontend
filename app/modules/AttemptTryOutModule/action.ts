import type { ActionFunctionArgs } from "react-router";
import { tryoutService } from "~/services/tryout.service";

export async function TryOutAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const { subtestAttemptId } = params;

  if (!subtestAttemptId) {
    throw new Error("Subtest attempt ID is required");
  }

  try {
    switch (intent) {
      case "submit-answer": {
        const tryoutAttemptId = formData.get("tryoutAttemptId") as string;
        const soalId = formData.get("soalId") as string;
        const jawaban = formData.get("jawaban") as string;

        await tryoutService.submitAnswer(tryoutAttemptId, subtestAttemptId, {
          soalId,
          jawaban,
        });

        return { success: true };
      }

      case "finish-subtest": {
        const result = await tryoutService.finishSubtest(subtestAttemptId);
        return result;
      }

      case "finish-tryout": {
        const tryoutAttemptId = formData.get("tryoutAttemptId") as string;
        const result = await tryoutService.finishTryout(tryoutAttemptId);
        return result;
      }

      default:
        throw new Error("Invalid intent");
    }
  } catch (error) {
    console.error("Action failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Action failed",
    };
  }
}
