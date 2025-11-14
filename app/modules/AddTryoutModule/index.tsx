"use client";
import { useState } from "react";
import { Form } from "react-router";

import { QuestionNumbersMenu } from "./components/QuestionNumbersMenu";
import { ArrowLeft1 } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

export const AddTryoutModule = () => {
  const [isActiveMenu, setActiveMenu] = useState<number | null>(null);
  return (
    <main className="min-h-screen px-20 mt-8 items-start gap-4 flex flex-col ">
      <Link to={"/admin"}>
        <div className="flex flex-row items-start mt-10 ml-10">
          <button className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft1 className="w-8 h-8" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-medium">Kembali Ke Menu Tryout</h1>
        </div>
      </Link>
      <div className="w-full shadow-md h-fit rounded-2xl ">
        <div className="w-full bg-[#4292FD] h-10 rounded-t-2xl" />
        <div className="text-center">
          <h1 className="font-semibold font-poppins my-5 text-3xl text-blue-800">
            Buat Tryout Baru
          </h1>
        </div>
        <Form
          method="post"
          className="px-4 py-6 space-y-4 w-fulls text-blue-800"
        >
          <div className="space-x-7">
            <label
              className="font-semibold text-2xl font-poppins"
              htmlFor="title"
            >
              Nama Tryout:
            </label>
            <input
              type="text"
              name="title"
              className="rounded-xl border-2 border-blue-300 px-3 py-2"
            />
          </div>
          <div className="space-x-7 flex flex-row">
            <label
              className="font-semibold text-2xl font-poppins"
              htmlFor="tanggal"
            >
              Tanggal:
            </label>
            <div className="space-x-2">
              <input
                type="datetime-local"
                name="publishedAt"
                className="rounded-xl border-2 border-blue-300 px-3 py-1"
              />
              <span>-</span>
              <input
                type="datetime-local"
                name="closedAt"
                className="rounded-xl border-2 border-blue-300 px-3 py-1"
              />
            </div>
          </div>
          <div className="text-sm font-bold space-y-2 uppercase">
            <div className="space-y-3">
              <div>
                <p className="text-yellow-500 font-bold text-sm">Skolastik: </p>
                <ul className="list-disc ml-6">
                  <li> Penalaran Umum - 30/30 soal - 30 menit</li>
                  <li>
                    {" "}
                    Pengetahuan dan Pemahaman Umum - 20/20 soal - 15 menit
                  </li>
                  <li> Pemahaman Bacaan dan Menulis - 20/20 soal - 25 menit</li>
                  <li> Pengetahuan Kuantitatif - 20/20 soal - 20 menit</li>
                </ul>
              </div>
              <div>
                <p className="text-yellow-500 font-bold text-sm">Literasi:</p>
                <ul className="list-disc ml-6">
                  <li>Literasi Bahasa Indosia - 30/30 soal - 42.5 menit</li>
                  <li>Literasi Bahasa Inggris - 20/20 soal - 30 menit</li>
                  <li>Penalaran Matematika - 20/20 soal - 42.5 menit</li>
                </ul>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            onClick={() => console.log("jawa")}
            className="w-full"
            variant={"blue"}
          >
            Simpan
          </Button>
        </Form>
      </div>
    </main>
  );
};
