"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BACKEND_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Clock,
  FileText,
  Circle,
  Loader2,
} from "lucide-react";

// Hardcode the subtest flow as requested by the user
const SUBTESTS = [
    { name: "Penalaran Umum", abbr: "PU", order: 1 },
    { name: "Pemahaman & Penalaran Umum", abbr: "PPU", order: 2 },
    { name: "Pemahaman Bacaan & Menulis", abbr: "PBM", order: 3 },
    { name: "Pengetahuan Kuantitatif", abbr: "PK", order: 4 },
    { name: "Literasi Bahasa Indonesia", abbr: "LBI", order: 5 },
    { name: "Literasi Bahasa Inggris", abbr: "LBE", order: 6 },
    { name: "Penalaran Matematika", abbr: "PM", order: 7 },
];

const BREAK_DURATION_SEC = 30;

export default function BreakPage() {
  const router = useRouter();
  const params = useParams<{ id: string; subtestId: string }>();
  const searchParams = useSearchParams();

  const tryoutId = params?.id;
  const nextSubtestId = params?.subtestId;
  const attemptId = searchParams.get("attemptId");
  const prevSubtestName = searchParams.get("prevSubtestName") || "";
  const nextSubtestName =
    searchParams.get("nextSubtestName") || "Subtes Berikutnya";

  const [breakTimeRemainingSec, setBreakTimeRemainingSec] = useState<number | null>(null);

  // The 1-based order of the subtest that was just finished.
  const currentOrder = Number(nextSubtestId) - 1;

  const handleProceedToNext = useCallback(async () => {
    // Panggil API start-subtest untuk mereset timer di backend
    await fetch(
      `${BACKEND_URL}/exam/${encodeURIComponent(attemptId || "")}/start-subtest`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subtestOrder: Number(nextSubtestId) }),
      }
    );

    router.push(
      `/tryout/${tryoutId}/exam/${nextSubtestId}?attemptId=${encodeURIComponent(
        attemptId || ""
      )}`
    );
  }, [router, tryoutId, nextSubtestId, attemptId]);

  // Timer logic using localStorage
  useEffect(() => {
    if (!attemptId) {
      router.replace(`/tryout/${tryoutId}`);
      return;
    }
    
    const storageKey = `break_started_at_${attemptId}`;
    let startTimeIso = localStorage.getItem(storageKey);

    if (!startTimeIso) {
      startTimeIso = new Date().toISOString();
      localStorage.setItem(storageKey, startTimeIso);
    }
    
    const startTime = new Date(startTimeIso);

    const timer = setInterval(() => {
      const elapsedSec = (new Date().getTime() - startTime.getTime()) / 1000;
      const remaining = Math.max(0, Math.floor(BREAK_DURATION_SEC - elapsedSec));
      
      setBreakTimeRemainingSec(remaining);

      if (remaining === 0) {
        localStorage.removeItem(storageKey);
        handleProceedToNext();
      }
    }, 1000);

    // Initial calculation to prevent 1-second flash of null
    const initialElapsed = (new Date().getTime() - startTime.getTime()) / 1000;
    setBreakTimeRemainingSec(Math.max(0, Math.floor(BREAK_DURATION_SEC - initialElapsed)));


    return () => {
        clearInterval(timer);
    };
  }, [attemptId, tryoutId, router, handleProceedToNext]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 p-4 font-open-sans">
      <Card className="max-w-4xl w-full shadow-xl border-gray-200 overflow-hidden flex flex-col md:flex-row relative">
        {/* Left Side: Summary & Action */}
        <CardContent className="p-8 md:w-3/5 flex flex-col justify-between border-r border-gray-100 min-h-[500px]">
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Subtes Selesai!
              </h2>
              <p className="text-gray-600">
                Kamu telah menyelesaikan subtes{" "}
                <span className="font-semibold text-gray-900">
                  {prevSubtestName}
                </span>
                .
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <PlayCircle className="w-24 h-24 text-blue-600" />
              </div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                WAKTU ISTIRAHAT
              </p>
              <div className="text-6xl font-bold text-blue-600 my-4">
                {breakTimeRemainingSec ?? "-"}
              </div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2 relative z-10">
                Subtes Selanjutnya: {nextSubtestName}
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </h3>
            </div>
          </div>
          <Button onClick={() => {
              const storageKey = `break_started_at_${attemptId}`;
              localStorage.removeItem(storageKey);
              handleProceedToNext();
          }}>Lanjut ke Subtes Berikutnya</Button>
        </CardContent>

        {/* Right Side: Progress Stepper */}
        <div className="bg-gray-50 p-8 md:w-2/5 flex flex-col max-h-[600px]">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            Progres Ujian
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="relative pl-10 border-l-2 border-gray-200 space-y-8">
              {SUBTESTS.map((sub) => {
                const isFinished = sub.order <= currentOrder;
                const isNext = sub.order === currentOrder + 1;
                const isFuture = sub.order > currentOrder + 1;

                return (
                  <div key={sub.order} className="relative pl-6">
                    <div
                      className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full border-4 flex items-center justify-center transition-colors bg-white ${
                        isFinished
                          ? "border-blue-500 text-blue-600"
                          : isNext
                          ? "border-blue-500 text-blue-600"
                          : "border-gray-300 text-gray-300"
                      }`}
                    >
                      {isFinished ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isNext ? (
                        <PlayCircle className="w-5 h-5 fill-blue-50" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>

                    <div
                      className={`${isFuture ? "opacity-50" : "opacity-100"}`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                        Subtes {sub.order}
                      </p>
                      <h4
                        className={`font-bold text-lg leading-tight ${
                          isNext ? "text-blue-700" : "text-gray-900"
                        }`}
                      >
                        {sub.name}
                      </h4>

                      {isNext && (
                        <span className="inline-block mt-2 text-xs font-medium text-white bg-blue-600 px-2 py-0.5 rounded-full animate-pulse">
                          Selanjutnya
                        </span>
                      )}
                      {isFinished && (
                        <span className="inline-block mt-2 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Selesai
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
