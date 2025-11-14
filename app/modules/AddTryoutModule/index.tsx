"use client";
import { useState } from "react";
import { Form } from "react-router";

import { ArrowLeft1 } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

const SUBTEST_CONFIGS = [
  {
    name: "Penalaran Umum",
    type: "PU",
    defaultSoal: 20,
    defaultMenit: 30,
    kategori: "SKOLASTIK",
  },
  {
    name: "Pengetahuan dan Pemahaman Umum",
    type: "PPU",
    defaultSoal: 20,
    defaultMenit: 25,
    kategori: "SKOLASTIK",
  },
  {
    name: "Pemahaman Bacaan dan Menulis",
    type: "PBM",
    defaultSoal: 20,
    defaultMenit: 25,
    kategori: "SKOLASTIK",
  },
  {
    name: "Pengetahuan Kuantitatif",
    type: "PK",
    defaultSoal: 20,
    defaultMenit: 30,
    kategori: "SKOLASTIK",
  },
  {
    name: "Literasi Bahasa Indonesia",
    type: "LBI",
    defaultSoal: 30,
    defaultMenit: 45,
    kategori: "LITERASI",
  },
  {
    name: "Literasi Bahasa Inggris",
    type: "LBE",
    defaultSoal: 30,
    defaultMenit: 45,
    kategori: "LITERASI",
  },
  {
    name: "Penalaran Matematika",
    type: "PM",
    defaultSoal: 20,
    defaultMenit: 45,
    kategori: "LITERASI",
  },
];

export const AddTryoutModule = () => {
  const [subtestValues, setSubtestValues] = useState<
    Record<string, { soal: number; menit: number }>
  >(
    SUBTEST_CONFIGS.reduce(
      (acc, config) => ({
        ...acc,
        [config.type]: { soal: config.defaultSoal, menit: config.defaultMenit },
      }),
      {}
    )
  );

  const handleSubtestChange = (
    type: string,
    field: "soal" | "menit",
    value: number
  ) => {
    setSubtestValues((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const skolastikSubtests = SUBTEST_CONFIGS.filter(
    (s) => s.kategori === "SKOLASTIK"
  );
  const literasiSubtests = SUBTEST_CONFIGS.filter((s) => s.kategori === "LITERASI");

  return (
    <main className="min-h-screen px-20 mt-8 items-start gap-4 flex flex-col">
      <Link to={"/admin"}>
        <div className="flex flex-row items-start mt-10 ml-10">
          <button className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft1 className="w-8 h-8" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-medium">Kembali Ke Menu Tryout</h1>
        </div>
      </Link>

      <div className="w-full shadow-md h-fit rounded-2xl">
        <div className="w-full bg-[#4292FD] h-10 rounded-t-2xl" />
        <div className="text-center">
          <h1 className="font-semibold font-poppins my-5 text-3xl text-blue-800">
            Buat Tryout Baru
          </h1>
        </div>

        <Form
          method="post"
          className="px-8 py-6 space-y-6 w-full text-blue-800"
        >
          {/* Nama Tryout */}
          <div className="flex items-center space-x-7">
            <label
              className="font-semibold text-xl font-poppins min-w-[150px]"
              htmlFor="name"
            >
              Nama Tryout:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="Meong"
              className="flex-1 rounded-xl border-2 border-blue-300 px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Tanggal */}
          <div className="flex items-center space-x-7">
            <label
              className="font-semibold text-xl font-poppins min-w-[150px]"
              htmlFor="publishedAt"
            >
              Tanggal:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="datetime-local"
                name="publishedAt"
                id="publishedAt"
                required
                defaultValue="2025-12-06T15:00"
                className="rounded-xl border-2 border-blue-300 px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <span className="text-2xl">-</span>
              <input
                type="datetime-local"
                name="closedAt"
                id="closedAt"
                required
                defaultValue="2025-12-06T15:00"
                className="rounded-xl border-2 border-blue-300 px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                className="ml-2 w-8 h-8 flex items-center justify-center border-2 border-blue-300 rounded-lg hover:bg-blue-50"
              >
                <span className="text-blue-500 text-xl">+</span>
              </button>
            </div>
          </div>

          {/* SKOLASTIK Section */}
          <div className="space-y-3">
            <p className="text-yellow-500 font-bold text-base uppercase">
              SKOLASTIK:
            </p>
            <div className="space-y-2">
              {skolastikSubtests.map((subtest) => (
                <div key={subtest.type} className="flex items-center text-sm">
                  <span className="w-8">•</span>
                  <span className="flex-1">{subtest.name}</span>
                  <span className="mx-2">-</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      name={`${subtest.type}_questionCount`}
                      min="1"
                      value={subtestValues[subtest.type]?.soal || subtest.defaultSoal}
                      onChange={(e) =>
                        handleSubtestChange(
                          subtest.type,
                          "soal",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-500"
                    />
                    <span>Soal</span>
                  </div>
                  <span className="mx-2">-</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      name={`${subtest.type}_duration`}
                      min="1"
                      value={subtestValues[subtest.type]?.menit || subtest.defaultMenit}
                      onChange={(e) =>
                        handleSubtestChange(
                          subtest.type,
                          "menit",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-500"
                    />
                    <span>Menit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LITERASI Section */}
          <div className="space-y-3">
            <p className="text-yellow-500 font-bold text-base uppercase">
              LITERASI:
            </p>
            <div className="space-y-2">
              {literasiSubtests.map((subtest) => (
                <div key={subtest.type} className="flex items-center text-sm">
                  <span className="w-8">•</span>
                  <span className="flex-1">{subtest.name}</span>
                  <span className="mx-2">-</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      name={`${subtest.type}_questionCount`}
                      min="1"
                      value={subtestValues[subtest.type]?.soal || subtest.defaultSoal}
                      onChange={(e) =>
                        handleSubtestChange(
                          subtest.type,
                          "soal",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-500"
                    />
                    <span>Soal</span>
                  </div>
                  <span className="mx-2">-</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      name={`${subtest.type}_duration`}
                      min="1"
                      value={subtestValues[subtest.type]?.menit || subtest.defaultMenit}
                      onChange={(e) =>
                        handleSubtestChange(
                          subtest.type,
                          "menit",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-blue-500"
                    />
                    <span>Menit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-6 text-lg"
              variant="blue"
            >
              Buat
            </Button>
          </div>
        </Form>
      </div>
    </main>
  );
};
