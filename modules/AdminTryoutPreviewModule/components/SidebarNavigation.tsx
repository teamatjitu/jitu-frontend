import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SidebarNavigationProps {
  subtests: any[];
  activeSubtestIndex: number;
  activeQuestionIndex: number;
  questions: any[];
  onSubtestChange: (idx: number) => void;
  onQuestionChange: (idx: number) => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  subtests,
  activeSubtestIndex,
  activeQuestionIndex,
  questions,
  onSubtestChange,
  onQuestionChange,
}) => {
  return (
    <div className="lg:col-span-3 space-y-6">
      <Card className="sticky top-20 bg-white shadow-sm border-gray-200">
        <CardContent className="p-6">
          <div className="mb-6 space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Pilih Subtest
            </p>
            <div className="flex flex-col gap-1">
              {subtests.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => onSubtestChange(idx)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeSubtestIndex === idx
                      ? "bg-blue-500 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {idx + 1}. {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 my-4"></div>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Navigasi Soal
            </p>
            <div className="flex flex-wrap gap-2 items-center justify-start">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onQuestionChange(idx)}
                  className={`flex-none w-[calc(30%-0.4rem)] max-w-[45px] aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                    activeQuestionIndex === idx
                      ? "bg-yellow-400 text-gray-900 ring-4 ring-yellow-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest text-center">
              Status Soal
            </p>
            <p className="text-xs text-emerald-600 text-center mt-1 italic">
              Preview menampilkan kunci jawaban asli.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
