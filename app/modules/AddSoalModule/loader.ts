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
        // 3. Set header Content-Type agar React Router tahu ini JSON
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    // 6. Tangani error (jika fetch gagal, dll.)
    console.error("AddSoalLoader gagal:", error);
    // Lempar error 500 (Internal Server Error) atau 502 (Bad Gateway)
    // Ini akan menampilkan ErrorBoundary di Remix
    throw new Response("Gagal mengambil data dari server backend", {
      status: 502,
    });
  }
}
