import { useState } from "react";
import { QuestionCard } from "./components/QuestionCard";
import { QuestionNumbersMenu } from "./components/QuestionNumbersMenu";
import { Button } from "~/components/ui/button";
import { ArrowLeft1, ArrowRight1 } from "~/components/icons";
import { TipeSoal } from "./enums";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type AddSoalModuleProps = {
  tryout: Tryout;
  tryoutAttempt: TryoutAttempt;
};

type SavedQuestion = {
  pertanyaan: string;
  pembahasan?: string;
  tipe: string;
  opsi: { teks: string; is_correct: boolean }[];
};

export const AddSoalModule = ({
  tryout,
  tryoutAttempt,
}: AddSoalModuleProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questionTypes, setQuestionTypes] = useState<Record<number, string>>(
    {}
  );

  // NEW: saved questions map
  const [savedQuestions, setSavedQuestions] = useState<
    Record<number, SavedQuestion>
  >({});

  // toast
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const showToast = (message: string) => {
    setToast({ open: true, message });
    setTimeout(() => setToast({ open: false, message: "" }), 3000);
  };

  const goToQuestion = (questionNum: number) => {
    setCurrentQuestion(questionNum);
  };

  const nextQuestion = () => {
    if (currentQuestion < 30) {
      goToQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 1) {
      goToQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionTypeChange = (questionNum: number, type: string) => {
    setQuestionTypes((prev) => ({
      ...prev,
      [questionNum]: type,
    }));
  };

  const getCurrentQuestionType = () => {
    return questionTypes[currentQuestion] || "BS"; // Default to BS if not set
  };

  // NEW: save handler (local). Replace with fetch POST to your API endpoint as needed.
  const handleSaveQuestion = async (
    questionNum: number,
    payload: SavedQuestion
  ) => {
    // Example: send to server
    // await fetch('/api/admin/save-soal', { method: 'POST', body: JSON.stringify({ questionNum, ...payload }) })

    setSavedQuestions((prev) => ({
      ...prev,
      [questionNum]: payload,
    }));
    showToast(`Soal ${questionNum} berhasil disimpan`);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row px-12 gap-5 py-20">
      <QuestionNumbersMenu
        tipe={"soal"}
        currentQuestion={currentQuestion}
        onQuestionNumberClick={goToQuestion}
        savedQuestions={savedQuestions}
      />
      <div className="flex w-full gap-5 flex-col">
        <QuestionCard
          currentQuestion={currentQuestion}
          tipe={getCurrentQuestionType()}
          onQuestionTypeChange={(type) =>
            handleQuestionTypeChange(currentQuestion, type)
          }
          onSave={handleSaveQuestion}
          savedData={savedQuestions[currentQuestion] ?? null}
        />
        <div className="flex flex-row justify-between">
          <div className="w-1/5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <p className="py-2">
                  Tipe Soal:{" "}
                  {getCurrentQuestionType() === "PG"
                    ? "Pilihan Ganda"
                    : getCurrentQuestionType() === "IS"
                    ? "Isian Singkat"
                    : "Benar Salah"}
                </p>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      handleQuestionTypeChange(currentQuestion, "PG")
                    }
                  >
                    Pilihan Ganda
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleQuestionTypeChange(currentQuestion, "IS")
                    }
                  >
                    Isian Singkat
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleQuestionTypeChange(currentQuestion, "BS")
                    }
                  >
                    Benar Salah
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-x-4">
            <Button
              onClick={prevQuestion}
              variant="transparentBlack"
              size="lg"
              disabled={currentQuestion === 1}
              className="w-[92px] h-[48px] px-4 py-3"
            >
              <ArrowLeft1 className="text-gray-700" />
            </Button>

            <Button
              onClick={nextQuestion}
              variant="transparentBlack"
              size="lg"
              disabled={currentQuestion === 30}
              className="w-[92px] h-[48px] px-4 py-3"
            >
              <ArrowRight1 />
            </Button>
          </div>
        </div>
      </div>

      {/* simple toast */}
      {toast.open && (
        <div className="fixed right-6 top-6 z-50">
          <div className="bg-black text-white px-4 py-2 rounded shadow">
            {toast.message}
          </div>
        </div>
      )}
    </main>
  );
};
