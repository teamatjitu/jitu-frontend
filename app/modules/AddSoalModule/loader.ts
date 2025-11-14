import type { LoaderFunctionArgs } from "react-router";
import { getSoalByTryoutAndSubtest } from "~/api/admin";
import { Subtest, TipeSoal } from "./enums";
export async function AddSoalLoader({ request, params }: LoaderFunctionArgs) {
  const { id, subtest } = params;

  // 3. Validasi parameter
  if (!id || !subtest) {
    // Jika parameter tidak ada, lempar error 400 (Bad Request)
    throw new Response("URL tidak valid: tryoutId atau subtest hilang", {
      status: 400,
    });
  }

  try {
    // 4. Panggil fungsi API Anda
    // Sebaiknya gunakan .toUpperCase() di sini agar konsisten
    // dengan backend (yang mengharapkan enum) dan komponen lain
    const soalList = await getSoalByTryoutAndSubtest(id, subtest.toUpperCase());

    // 5. Kembalikan data sebagai JSON
    // Ini adalah data yang akan diterima oleh useLoaderData()
    const dataString = JSON.stringify({ soalList });
    return new Response(dataString, {
      status: 200, // 200 OK
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("AddSoalLoader gagal:", error);
    throw new Response("Gagal mengambil data dari server backend", {
      status: 502,
    });
  }
}
