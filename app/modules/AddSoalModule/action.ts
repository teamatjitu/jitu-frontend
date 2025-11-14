import type { ActionFunctionArgs } from "react-router";
import { createSoal, editSoal } from "~/api/admin";

export async function AddSoalAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const pertanyaan = String(formData.get("pertanyaan") ?? "");
  const pembahasanTeks = String(formData.get("pembahasan") ?? "");
  const tryoutId = String(formData.get("tryoutId"));
  const subtest = String(formData.get("subtest"));
  const tipe = String(formData.get("tipe"));
  const soalId = String(formData.get("soalId") ?? "");
  const isEdit = String(formData.get("isEdit") ?? "false") === "true";

  let tipeSoalEnum = "PILIHAN_GANDA";
  if (tipe === "BS") tipeSoalEnum = "BENAR_SALAH";
  if (tipe === "IS") tipeSoalEnum = "ISIAN_SINGKAT";

  const opsiTeksAll = formData.getAll("opsi_teks") as string[];
  const opsiIsCorrectAll = formData.getAll("opsi_is_correct") as string[];

  const opsiPayload = opsiTeksAll.map((teks, index) => ({
    teks: teks,
    isCorrect: opsiIsCorrectAll[index] === "true",
  }));

  const hasCorrectAnswer = opsiPayload.some((o) => o.isCorrect);
  if ((tipe === "PG" || tipe === "BS") && !hasCorrectAnswer) {
    return {
      success: false,
      message: "Pilih minimal satu kunci jawaban yang benar",
    };
  }

  const soalData = {
    tryoutId: tryoutId,
    subtestType: subtest,
    tipeSoal: tipeSoalEnum,
    question: pertanyaan,
    opsi: opsiPayload,
    pembahasanSoal: pembahasanTeks ? { pembahasan: pembahasanTeks } : undefined,
  };

  try {
    let result;
    if (isEdit && soalId) {
      result = await editSoal(soalId, soalData);
    } else {
      result = await createSoal(soalData);
    }

    if (result && !result.message) {
      return { success: true, soal: result };
    } else {
      return {
        success: false,
        message: result?.message || "Gagal menyimpan soal.",
      };
    }
  } catch (error) {
    console.error("Gagal membuat/mengupdate soal:", error);
    return {
      success: false,
      message: "Gagal menyimpan soal. Cek koneksi atau data.",
    };
  }
}
