import type { ActionFunctionArgs } from "react-router";
import { createSoal } from "~/api/admin";

export async function AddSoalAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // 1. Ambil data dasar
  const pertanyaan = String(formData.get("pertanyaan") ?? "");
  const pembahasanTeks = String(formData.get("pembahasan") ?? "");
  const tryoutId = String(formData.get("tryoutId"));
  const subtest = String(formData.get("subtest"));
  const tipe = String(formData.get("tipe"));

  // 2. Mapping tipe soal ke Enum Backend
  let tipeSoalEnum = "PILIHAN_GANDA";
  if (tipe === "BS") tipeSoalEnum = "BENAR_SALAH";
  if (tipe === "IS") tipeSoalEnum = "ISIAN_SINGKAT";

  // 3. TANGKAP ARRAY OPSI
  // .getAll() akan mengembalikan array semua nilai input dengan name tersebut
  const opsiTeksAll = formData.getAll("opsi_teks") as string[];
  const opsiIsCorrectAll = formData.getAll("opsi_is_correct") as string[];

  // 4. Rakit Opsi menjadi Object
  // Kita asumsikan panjang opsiTeksAll dan opsiIsCorrectAll selalu sama
  // karena mereka dirender berpasangan di UI.
  const opsiPayload = opsiTeksAll.map((teks, index) => ({
    teks: teks,
    // Konversi string "true"/"false" dari hidden input menjadi boolean
    isCorrect: opsiIsCorrectAll[index] === "true",
  }));

  // Validasi sederhana (opsional, sebaiknya ada minimal 1 jawaban benar untuk PG/BS)
  const hasCorrectAnswer = opsiPayload.some((o) => o.isCorrect);
  if ((tipe === "PG" || tipe === "BS") && !hasCorrectAnswer) {
    // return json({ error: "Pilih minimal satu kunci jawaban yang benar!" }, { status: 400 });
    // Atau jika pakai toast session bisa ditaruh disini
  }

  // 5. Susun Payload Akhir sesuai struktur yang diminta SoalService NestJS
  // Perhatikan struktur DTO yang diharapkan backend kamu.
  const soalData = {
    tryoutId: tryoutId,
    subtestType: subtest, // Pastikan casing sudah uppercase dari form
    tipeSoal: tipeSoalEnum,
    question: pertanyaan,
    // Kirim opsi yang sudah dirakit
    opsi: opsiPayload,
    // Kirim pembahasan jika ada isinya.
    // Backend kamu mengharapkan object { pembahasan: string } untuk create nested
    pembahasan: pembahasanTeks ? { pembahasan: pembahasanTeks } : undefined,
  };

  console.log("Payload to Backend:", JSON.stringify(soalData, null, 2)); // Debugging

  try {
    await createSoal(soalData);
    // return redirect("/sukses"); // Sebaiknya redirect setelah sukses
    return { success: true };
  } catch (error) {
    console.error("Gagal membuat soal:", error);
    return { message: "Gagal menyimpan soal. Cek koneksi atau data." };
  }
}
