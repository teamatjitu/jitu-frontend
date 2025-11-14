import type { LoaderFunctionArgs } from "react-router";
import { getSoalByTryoutAndSubtest } from "~/api/admin";
import type { GetSoalBySubtestResponse } from "./type";

export async function AddSoalLoader({ params }: LoaderFunctionArgs) {
  const { id, subtest } = params;

  if (!id || !subtest) {
    throw new Response("URL tidak valid: tryoutId atau subtest hilang", {
      status: 400,
    });
  }

  try {
    const data: GetSoalBySubtestResponse = await getSoalByTryoutAndSubtest(
      id,
      subtest.toUpperCase()
    );

    return {
      soalList: data.soal,
      subtest: data.subtest,
      total: data.total,
    };
  } catch (error) {
    console.error("AddSoalLoader gagal:", error);
    throw new Response("Gagal mengambil data dari server backend", {
      status: 502,
    });
  }
}
