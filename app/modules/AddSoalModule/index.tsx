import { useState, useEffect } from "react";
import { QuestionCard } from "./components/QuestionCard";
import { QuestionNumbersMenu } from "./components/QuestionNumbersMenu";
import { Button } from "~/components/ui/button";
import { ArrowLeft1, ArrowRight1 } from "~/components/icons";
import { TipeSoal } from "./enums";
import { Link } from "react-router";

import { useActionData, useParams } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type AddSoalModuleProps = {
  soalList?: Soal[];
};

type SavedQuestion = {
  id?: string;
  pertanyaan: string;
  pembahasan?: string;
  tipe: string;
  opsi: { teks: string; is_correct: boolean }[];
};

export const AddSoalModule = ({ soalList = [] }: AddSoalModuleProps) => {
  const { subtest } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questionTypes, setQuestionTypes] = useState<Record<number, string>>(
    {}
  );
  const [pendingQuestion, setPendingQuestion] = useState<number | null>(null);

  const initializeSavedQuestions = (soalList: Soal[]) => {
    const saved: Record<number, SavedQuestion> = {};
    soalList.forEach((soal, index) => {
      const questionNum = index + 1;
      saved[questionNum] = {
        id: soal.id,
        pertanyaan: soal.question,
        pembahasan: soal.pembahasanSoal?.pembahasan,
        tipe:
          soal.tipeSoal === "PILIHAN_GANDA"
            ? "PG"
            : soal.tipeSoal === "BENAR_SALAH"
            ? "BS"
            : "IS",
        opsi: soal.opsi.map((o) => ({ teks: o.teks, is_correct: o.isCorrect })),
      };
    });
    return saved;
  };

  const [savedQuestions, setSavedQuestions] = useState<
    Record<number, SavedQuestion>
  >(initializeSavedQuestions(soalList));

  useEffect(() => {
    setCurrentQuestion(1);
    setSavedQuestions(initializeSavedQuestions(soalList));
    setQuestionTypes({});
    setPendingQuestion(null);

    if (soalList.length === 0) {
      setPendingQuestion(1);
      setCurrentQuestion(1);
    }
  }, [subtest, soalList]);

  const actionData = useActionData() as
    | { success: boolean; message: string }
    | undefined;

  // toast
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const showToast = (message: string) => {
    setToast({ open: true, message });
    setTimeout(() => setToast({ open: false, message: "" }), 3000);
  };

  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        showToast("Soal berhasil disimpan");

        // Remove from pending question
        setPendingQuestion(null);

        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast(actionData.message || "Gagal menyimpan soal");
      }
    }
  }, [actionData, currentQuestion]);

  const goToQuestion = (questionNum: number) => {
    // If clicking on "Add Soal" button (questionNum > saved questions count)
    if (questionNum > soalList.length) {
      // Only allow one pending question at a time
      if (pendingQuestion === null) {
        const newPendingNum = soalList.length + 1;
        setPendingQuestion(newPendingNum);
        setCurrentQuestion(newPendingNum);
      } else if (questionNum === pendingQuestion) {
        setCurrentQuestion(pendingQuestion);
      }
    } else {
      // Jika klik pending question box, navigate ke pending question
      if (pendingQuestion === questionNum) {
        setCurrentQuestion(questionNum);
      } else {
        // Navigate ke soal yang sudah ada
        setCurrentQuestion(questionNum);
      }
    }
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
    setCurrentQuestion(0);
  };

  const handleCancelPending = () => {
    setPendingQuestion(null);
    // Navigate to first saved question or stay if there are saved questions
    if (soalList.length > 0) {
      setCurrentQuestion(1);
    }
  };

  const getCurrentQuestionType = () => {
    return questionTypes[currentQuestion] || "BS";
  };

  return (
    <main className="min-h-screen flex flex-col px-12 gap-5 py-20">
      <div>
        <Link to={"/admin"}>
          <Button variant={"blue"} className="px-4 py-5">
            Kembali
          </Button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <QuestionNumbersMenu
          tipe={"soal"}
          currentQuestion={currentQuestion}
          onQuestionNumberClick={goToQuestion}
          savedQuestions={savedQuestions}
          pendingQuestion={pendingQuestion}
          soal={soalList.length}
        />
        <div className="flex w-full justify-center gap-5 flex-col">
          <div className="max-w-[77rem]">
            <QuestionCard
              currentQuestion={currentQuestion}
              tipe={getCurrentQuestionType()}
              onQuestionTypeChange={(type) =>
                handleQuestionTypeChange(currentQuestion, type)
              }
              savedData={savedQuestions[currentQuestion] ?? null}
              onCancel={handleCancelPending}
              isPending={pendingQuestion === currentQuestion}
            />
          </div>
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
