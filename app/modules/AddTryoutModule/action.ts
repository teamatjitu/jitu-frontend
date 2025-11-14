import { redirect, type ActionFunctionArgs } from "react-router";
import { adminTryoutService } from "~/services/admin-tryout.service";

export async function AddTryoutAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = String(formData.get("name"));
  const publishedAt = String(formData.get("publishedAt"));
  const closedAt = String(formData.get("closedAt"));

  // Parse subtest customizations
  const subtestTypes = ["PU", "PPU", "PBM", "PK", "LBI", "LBE", "PM"];
  const subtestCustomizations = subtestTypes
    .map((type) => {
      const questionCount = formData.get(`${type}_questionCount`);
      const duration = formData.get(`${type}_duration`);

      return {
        type: type as any,
        questionCount: questionCount ? parseInt(String(questionCount)) : undefined,
        duration: duration ? parseInt(String(duration)) : undefined,
      };
    })
    .filter((custom) => custom.questionCount !== undefined || custom.duration !== undefined);

  try {
    // Extract year from publishedAt
    const year = new Date(publishedAt).getFullYear();

    await adminTryoutService.createUTBKTryout({
      name,
      year,
      publishedAt: new Date(publishedAt).toISOString(),
      closedAt: new Date(closedAt).toISOString(),
      subtestCustomizations: subtestCustomizations.length > 0 ? subtestCustomizations : undefined,
    });

    return redirect("/admin");
  } catch (error) {
    console.error("Failed to create tryout:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to create tryout",
    };
  }
}
