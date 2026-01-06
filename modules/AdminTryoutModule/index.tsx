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
      <div>
        <h2>Daftar Tryout</h2>
        {tryouts.map((tryout) => (
          <p>{tryout.title}</p>
        ))}
      </div>
    </div>
  );
};

export default AdminTryoutModule;
