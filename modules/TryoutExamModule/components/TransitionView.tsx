import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Circle,
  PlayCircle,
  LogOut,
  FileText,
} from "lucide-react";
// import { useState, useEffect } from 'react'; // Removed local state and effect

interface SubtestInfo {
  id: string;
  name: string;
  order: number;
  durationMinutes: number;
  questionCount: number;
}

interface TransitionViewProps {
  currentSubtestName: string;
  nextSubtestName: string;
  onNext: () => void;
  onExit: () => void;
  subtests: SubtestInfo[];
  currentOrder: number; // Order dari subtes yang BARU SAJA selesai
  breakTimeRemainingSec: number | null; // New prop for break time
}

export function TransitionView({
  currentSubtestName,
  nextSubtestName,
  onNext,
  onExit,
  subtests,
  currentOrder,
  breakTimeRemainingSec,
}: TransitionViewProps) {
  // const [countdown, setCountdown] = useState(30); // Removed local state
  const isLastSubtest = currentOrder === Math.max(...subtests.map((s) => s.order));

  // Removed local useEffect for countdown, now driven by SSE

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-open-sans">
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
                  {currentSubtestName}
                </span>
                .
              </p>
            </div>

            {isLastSubtest ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <PlayCircle className="w-24 h-24 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  Status Akhir
                </p>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 relative z-10">
                  Selesai Ujian
                </h3>
                <p className="text-sm text-gray-500 mt-2 flex items-start gap-2 relative z-10">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    Kamu telah menyelesaikan semua subtes dalam tryout ini. Klik tombol di bawah untuk mengakhiri dan melihat nilai.
                  </span>
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <PlayCircle className="w-24 h-24 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  WAKTU ISTIRAHAT
                </p>
                <div className="text-6xl font-bold text-blue-600 my-4">{breakTimeRemainingSec}</div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2 relative z-10">
                  Subtes Selanjutnya: {nextSubtestName}
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </h3>
              </div>
            )}
          </div>

          {isLastSubtest && (
            <div className="space-y-3">
              <Button
                onClick={onNext}
                className={`w-full py-6 rounded-xl font-bold text-base shadow-lg transition-all hover:scale-[1.02] bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200`}
              >
                Selesaikan Ujian
              </Button>
            </div>
          )}
        </CardContent>

        {/* Right Side: Progress Stepper */}
        <div className="bg-gray-50 p-8 md:w-2/5 flex flex-col max-h-[600px]">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            Progres Ujian
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="relative pl-10 border-l-2 border-gray-200 space-y-8">
              {subtests.map((sub) => {
                const isFinished = sub.order <= currentOrder;
                const isNext = sub.order === currentOrder + 1;
                const isFuture = sub.order > currentOrder + 1;

                return (
                  <div key={sub.id} className="relative pl-6">
                    {/* Dot Indicator */}
                    <div
                      className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full border-4 flex items-center justify-center transition-colors bg-white ${
                        isFinished
                          ? "border-green-500 text-green-600"
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

                    {/* Content */}
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
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {sub.durationMinutes} mnt
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FileText className="w-3 h-3" />
                            {sub.questionCount} soal
                        </div>
                      </div>

                      {isNext && (
                        <span className="inline-block mt-2 text-xs font-medium text-white bg-blue-600 px-2 py-0.5 rounded-full animate-pulse">
                          Selanjutnya
                        </span>
                      )}
                      {isFinished && (
                        <span className="inline-block mt-2 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
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
