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
        <div className="bg-blue-800 rounded-sm gap-4 px-4 py-2.5 flex flex-row items-center">
          <Library />
          <div>
            <p className="text-white text-2xl font-medium">My Collection</p>
            <p className="text-lg  text-gray-100">
              Kumpulan Tryout yang telah kamu daftarkan
            </p>
          </div>
        </div>

        <div className="bg-yellow-500 rounded-sm gap-4 px-4 py-2.5 flex flex-row items-center justify-between">
          <div>
            <p className="text-white text-2xl font-medium">Premium Plan</p>
            <p className="text-lg  text-gray-500">
              Upgrade ke premium untuk membuka fitur fitur tambahan
            </p>
          </div>

          <button className="bg-white text-[#1D3375] text-lg w-28 hover:cursor-pointer font-semibold px-4 py-2 rounded-3xl">
            Beli
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col gap-6 text-start items-start mb-14 justify-center w-3/4">
          <h1 className="text-2xl text-[#285898] mb-7 font-semibold">
            Sedang Berlangsung
          </h1>

          {tryouts
            .filter((t) => t.status === "ongoing")
            .map((t, index) => (
              <div
                key={index}
                className="bg-blue-500 shadow-lg w-full shadow-blue-500 rounded-sm gap-4 px-4 py-2.5 flex flex-row items-center justify-between"
              >
                <div>
                  <p className="text-[#FED768] text-2xl font-medium">
                    {t.judul}
                  </p>
                  <p className="text-lg  text-white">{t.tanggal}</p>
                </div>
                <Link to={t.link}>
                  <button className="bg-yellow-500 text-white text-lg w-40 hover:cursor-pointer px-4 py-2 rounded-lg">
                    Daftar
                  </button>
                </Link>
              </div>
            ))}
        </div>

        <div className="flex flex-col text-start gap-4 items-start mb-14 justify-center w-3/4">
          <h1 className="text-2xl text-[#285898] mb-7 font-semibold">
            Tryout yang akan Datang
          </h1>

          {tryouts
            .filter((t) => t.status === "upcoming")
            .map((t, index) => (
              <div
                key={index}
                className="bg-blue-800 w-full rounded-sm gap-4 px-4 py-2.5 flex flex-row items-center justify-between"
              >
                <div>
                  <p className="text-[#FED768] text-2xl font-medium">
                    {t.judul}
                  </p>
                  <p className="text-lg  text-white">{t.tanggal}</p>
                </div>
                <Link to={t.link}>
                  <button className="bg-yellow-500 text-white text-lg w-40 hover:cursor-pointer px-4 py-2 rounded-lg">
                    Daftar
                  </button>
                </Link>
              </div>
            ))}
        </div>

        <div className="flex flex-col text-start gap-4 items-start justify-center w-3/4">
          <h1 className="text-2xl text-[#285898] mb-7 font-semibold">
            Telah Berlangsung
          </h1>

          {tryouts
            .filter((t) => t.status === "finished")
            .map((t, index) => (
              <div
                key={index}
                className="bg-blue-800  w-full  rounded-sm gap-4 px-4 py-2.5 flex flex-row items-center justify-between"
              >
                <div>
                  <p className="text-[#FED768] text-2xl font-medium">
                    {t.judul}
                  </p>
                  <p className="text-lg  text-white">{t.tanggal}</p>
                </div>

                <Link to={t.link}>
                  <button className="bg-yellow-500 text-white text-lg w-40 hover:cursor-pointer px-4 py-2 rounded-lg">
                    Daftar
                  </button>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
};
