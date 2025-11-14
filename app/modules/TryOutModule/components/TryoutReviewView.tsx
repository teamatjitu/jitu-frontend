import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft1, ArrowRight1 } from "~/components/icons";

import { QuestionNumbersAndBtn } from "./QuestionNumbersAndBtn";
import { QuestionInput } from "./QuestionInput";
import { TipeSoal } from "../enums";

export function TryoutReviewView({ tryoutAttempt }: { tryoutAttempt: TryoutAttempt }) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const correctCount = tryoutAttempt.soalAttempt.filter(attempt => attempt.isCorrect).length;

  const tryout = tryoutAttempt.tryout;

  const nextQuestion = () => {
    if (currentQuestion < tryout.soal.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen bg-bg-white font-['Poppins',sans-serif]">
      {/* Navbar */}
      <nav className="h-[70px] px-5 md:px-20 flex items-center bg-bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft1 className="w-8 h-8" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-medium">{tryout.name}</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-5 md:px-20 py-4 md:py-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[308px] flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-[0_0_4px_rgba(0,0,0,0.15)]">
              {/* Title */}
              <div className="mb-5">
                <h2 className="text-xl font-medium mb-0.5">Penalaran Umum</h2>
                <p className="text-xs text-gray-400">{tryout.soal.length} Soal | {tryout.duration} Menit</p>
              </div>

              {/* Correct Answers */}
              <div className="mb-5">
                <p className="text-xs text-gray-400">Jawaban benar</p>

                <p className="font-semibold text-3xl">{correctCount}/{tryout.soal.length}</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-5"></div>

              <QuestionNumbersAndBtn
                tryout={tryout}
                stateStyles={{
                  correct: "bg-[#35CA89]/50 text-gray-800",
                  incorrect: "bg-[#D75353]/50 text-gray-800",
                }}
                questionToStateFn={(questionIndex) => {
                  const isCorrect = tryoutAttempt.soalAttempt[questionIndex - 1]?.isCorrect;
                  return isCorrect ? "correct" : "incorrect";
                }}
                currentQuestion={currentQuestion}
                onQuestionNumberClick={(questionIndex) => setCurrentQuestion(questionIndex)}
                btnElement={<Button variant="default" size="lg" className="w-full">Tutup pembahasan</Button>}
              />
            </div>
          </div>

          {/* Main Question Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 shadow-[0_0_4px_rgba(0,0,0,0.15)] mb-4">
              {/* Question Text */}
              <div className="text-lg mb-5 whitespace-pre-line">
                {tryout.soal[currentQuestion-1].question}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.2)] mb-5"></div>

              <QuestionInput
                soal={tryout.soal[currentQuestion-1]}
                isReviewMode={true}
                userAnswer={tryoutAttempt.soalAttempt[currentQuestion - 1]?.jawaban || ""}
                correctAnswer={tryout.soal[currentQuestion-1].tipeSoal === TipeSoal.ISIAN_SINGKAT
                  ? "Correct Answer"
                  : tryout.soal[currentQuestion-1].opsi.find(opsi => opsi.isCorrect)?.teks || ""
                }
              />

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.2)] mb-5"></div>

              {/* Explanation */}
              <div>
                <h3 className="text-lg font-medium mb-2">Pembahasan</h3>
                <div className="text-base whitespace-pre-line">
                  {tryout.soal[currentQuestion-1].pembahasanSoal?.pembahasan || "Tidak ada pembahasan untuk soal ini."}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
              <div className="flex gap-2">
                <Button
                  onClick={prevQuestion}
                  variant="transparentBlack"
                  size="lg"
                  disabled={currentQuestion === 1}
                  className="w-[92px] h-[48px] px-4 py-3"
                >
                  <ArrowLeft1 className="text-gray-700"/>
                </Button>

                <Button
                  onClick={nextQuestion}
                  variant="transparentBlack"
                  size="lg"
                  disabled={currentQuestion === tryout.soal.length}
                  className="w-[92px] h-[48px] px-4 py-3"
                >
                  <ArrowRight1/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
