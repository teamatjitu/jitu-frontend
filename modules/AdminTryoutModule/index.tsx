"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CrossIcon } from "lucide-react";
import { stats } from "./const";
import { AdminTryoutResponse, AdminTryoutStatsResponse } from "./interface";
import { getAllTryouts, getTryoutStats } from "@/lib/api";

const AdminTryoutModule = () => {
  const [valueStats, setValueStats] = useState<AdminTryoutStatsResponse | null>(
    null
  );

  const [tryouts, setTryouts] = useState<AdminTryoutResponse[]>([]);

  useEffect(() => {
    getTryoutStats().then(setValueStats).catch(console.error);
    getAllTryouts().then(setTryouts).catch(console.error);
  }, []);

  return (
    <div className="flex-col gap-10 flex min-h-screen p-12 w-full">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold">Kelola Tryout</h1>
        <p>Kelola semua tryout UTBK yang tersedia</p>
      </div>
      <div className="">
        <Button variant={"primary"} className="font-semibold">
          Tambah Tryout Baru
        </Button>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-sm`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {stat.label}
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                {stat.label === "TOTAL TRYOUT"
                  ? valueStats?.totalTryout
                  : stat.label === "TRYOUT AKTIF"
                  ? valueStats?.totalActiveTryout
                  : stat.label === "SELESAI"
                  ? valueStats?.totalEndedTryout
                  : valueStats?.totalUpcomingTryout}
              </div>
              {stat.suffix && (
                <div className={`text-sm font-semibold ${stat.color}`}>
                  {stat.suffix}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <div className="">
        <h2 className="text-2xl font-semibold">Daftar Tryout</h2>
        <div className="relative w-full overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Id</th>
                <th className="px-4 py-3">Nama Tryout</th>
                <th className="px-4 py-3">Harga (Token)</th>
                <th className="px-4 py-3">Tanggal Rilis</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {tryouts.map((tryout) => {
                const date = new Date(tryout.releaseDate).toLocaleDateString(
                  "id-ID"
                );

                return (
                  <tr
                    key={tryout.code}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {tryout.code}
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900">
                      {tryout.title}
                    </td>

                    <td className="px-4 py-3">
                      {tryout.solutionPrice.toLocaleString("id-ID")}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">{date}</td>

                    <td className="px-4 py-3">{tryout.status}</td>

                    <td className="px-4 py-3 text-center">
                      <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTryoutModule;
