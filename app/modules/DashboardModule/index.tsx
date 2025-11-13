"use client";
import { useState } from "react";
import { Link } from "react-router";
import { Library } from "~/components/icons";
import { Button } from "~/components/ui/button";

type Tryout = {
  judul: string;
  tanggal: string;
  link: string;
  status: "ongoing" | "finished" | "upcoming";
};

export const DashboardModule = () => {
  const tryouts: Tryout[] = [
    {
      judul: "Tryout SNBT #1",
      tanggal: "1 Januari 2025",
      link: "www.example.com",
      status: "ongoing",
    },
    {
      judul: "Tryout SNBT #2",
      tanggal: "1 Januari 2025",
      link: "www.example.com",
      status: "ongoing",
    },
    {
      judul: "Tryout SNBT #3",
      tanggal: "1 Januari 2025",
      link: "www.example.com",
      status: "finished",
    },
    {
      judul: "Tryout SNBT #4",
      tanggal: "1 Januari 2025",
      link: "www.example.com",
      status: "upcoming",
    },
    {
      judul: "Tryout SNBT #5",
      tanggal: "1 Januari 2025",
      link: "www.example.com",
      status: "upcoming",
    },
  ];

  return (
    <main className="min-h-screen font-poppins px-20 py-20 items-center text-start flex flex-col">
      <div className="flex flex-col w-3/4 gap-5 mb-20">
        <div className="bg-gray-0 rounded-sm shadow-md gap-4 px-4 py-2.5 flex flex-row items-center">
          <Library color="#285898" />
          <div>
            <p className="text-blue-800 text-2xl font-medium">My Collection</p>
            <p className="text-lg text-blue-500 ">
              Kumpulan Tryout yang telah kamu daftarkan
            </p>
          </div>
        </div>

        <div className="bg-gray-0 rounded-sm shadow-md gap-4 px-4 py-2.5 flex flex-row items-center justify-between">
          <div>
            <p className="text-yellow-700 text-2xl font-medium">Premium Plan</p>
            <p className="text-lg  text-yellow-800">
              Upgrade ke premium untuk membuka fitur fitur tambahan
            </p>
          </div>

          <button className="text-white bg-yellow-500 text-lg w-32 hover:cursor-pointer font-semibold px-4 py-2 rounded-lg border-2 border-white/50">
            Beli
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col gap-6 text-start items-start mb-14 justify-center w-3/4">
          <h1 className="text-2xl text-blue-800 font-semibold">
            Sedang Berlangsung
          </h1>

          {tryouts
            .filter((t) => t.status === "ongoing")
            .map((t, index) => (
              <div
                key={index}
                className="bg-white w-full shadow-md rounded-sm gap-4 px-4 py-2.5 flex flex-row items-center justify-between"
              >
                <div>
                  <p className="text-blue-500 text-2xl font-medium">
                    {t.judul}
                  </p>
                  <p className="text-lg  text-black">{t.tanggal}</p>
                </div>
                <Link to={t.link}>
                  <button className="text-white max-md:hidden bg-blue-500 text-lg w-32 hover:cursor-pointer font-semibold px-4  py-2 rounded-lg border-2 border-white/50">
                    Daftar
                  </button>
                </Link>
              </div>
            ))}
        </div>

        <div className="flex flex-col text-start gap-4 items-start mb-14 justify-center w-3/4">
          <h1 className="text-2xl text-blue-800 mb-7 font-semibold">
            Tryout yang akan Datang
          </h1>

          {tryouts
            .filter((t) => t.status === "upcoming")
            .map((t, index) => (
              <div
                key={index}
                className="bg-white w-full shadow-md rounded-sm gap-4 px-4 py-2.5 flex flex-row items-center justify-between"
              >
                <div>
                  <p className="text-blue-500 text-2xl font-medium">
                    {t.judul}
                  </p>
                  <p className="text-lg  text-black">{t.tanggal}</p>
                </div>
                <Link to={t.link}>
                  <button className="text-white bg-blue-500 text-lg w-32 hover:cursor-pointer font-semibold px-4  py-2 rounded-lg border-2 border-white/50">
                    Daftar
                  </button>
                </Link>
              </div>
            ))}
        </div>

        <div className="flex flex-col text-start gap-4 items-start justify-center w-3/4">
          <h1 className="text-2xl text-blue-800 mb-7 font-semibold">
            Telah Berlangsung
          </h1>

          {tryouts
            .filter((t) => t.status === "finished")
            .map((t, index) => (
              <div
                key={index}
                className="bg-white w-full shadow-md rounded-sm gap-4 px-4 py-2.5 flex flex-row items-center justify-between"
              >
                <div>
                  <p className="text-blue-500 text-2xl font-medium">
                    {t.judul}
                  </p>
                  <p className="text-lg  text-black">{t.tanggal}</p>
                </div>
                <Link to={t.link}>
                  <button className="text-white bg-blue-500 text-lg w-32 hover:cursor-pointer font-semibold px-4  py-2 rounded-lg border-2 border-white/50">
                    Cek
                  </button>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};
