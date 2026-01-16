"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, RefreshCcw, AlertCircle, Clock } from "lucide-react";
import {
  DailyQuestionResponse,
  getTodayDailyQuestion,
} from "@/lib/api/AdminDailyApi";
import { TodayQuestionPreview } from "./components/TodayQuestionPreview";
import { DailyActivityStats } from "./components/DailyActivityStats";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const AdminDailyModule = () => {
  const [data, setData] = useState<DailyQuestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getNextUpdateDate = () => {
    const nextUpdate = new Date();
    nextUpdate.setDate(nextUpdate.getDate() + 1);
    nextUpdate.setHours(0, 0, 0, 0);
    return nextUpdate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getTodayDailyQuestion();
      setData(result);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data soal harian.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">
            Menganalisis bank soal...
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Bank Soal Kosong</AlertTitle>
          <AlertDescription>
            Sistem tidak menemukan satu pun soal di database. Silakan buat soal
            terlebih dahulu melalui menu Kelola Tryout.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Monitoring Soal Harian
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Pembaruan Berikutnya:{" "}
              <strong>{getNextUpdateDate()} • 00:00 WIB</strong>
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TodayQuestionPreview question={data} />
        </div>

        <div className="lg:col-span-1">
          <DailyActivityStats stats={data.stats} />
        </div>
      </div>

      <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-bold">Informasi Sistem Otomatis:</p>
          <p>
            Soal harian dipilih secara acak dari seluruh bank soal yang tersedia
          </p>
          <ul className="list-disc list-inside ml-1 opacity-90">
            <li>
              Pembaruan otomatis dilakukan setiap hari tepat pukul{" "}
              <strong>00:00 WIB</strong>.
            </li>
            <li>
              Seluruh pengguna akan mendapatkan soal yang sama di hari yang
              sama.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDailyModule;
