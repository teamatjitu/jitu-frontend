import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft1, ArrowRight1 } from "~/components/icons";

import { QuestionNumbersAndBtn } from "./QuestionNumbersAndBtn";
import { QuestionInput } from "./QuestionInput";
import { TipeSoal } from "../enums";

interface SubtestReviewViewProps {
  subtestAttempt: SubtestAttempt;
}

export function TryoutReviewView({ subtestAttempt }: SubtestReviewViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  
  const subtest = subtestAttempt.subtest;
  const soals = subtest.soal;
  
  // Create a map for faster lookup
  const soalAttemptMap = new Map(
    subtestAttempt.soalAttempt?.map(attempt => [attempt.soalId, attempt]) || []
  );

  const correctCount = subtestAttempt.soalAttempt?.filter(attempt => attempt.isCorrect).length || 0;

  const nextQuestion = () => {
    if (currentQuestion < soals.length) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getQuestionStatus = (questionIndex: number): string => {
    const soal = soals[questionIndex - 1];
    const attempt = soalAttemptMap.get(soal.id);
    return attempt?.isCorrect ? "correct" : "incorrect";
  };

  const getCurrentSoalAttempt = () => {
    const currentSoal = soals[currentQuestion - 1];
    return soalAttemptMap.get(currentSoal.id);
  };

  const getCorrectAnswer = (soal: Soal): string => {
    if (soal.tipeSoal === TipeSoal.BENAR_SALAH) {
      const correctOpsi = soal.opsi.find(o => o.isCorrect);
      return correctOpsi?.teks || "";
    }
    
    if (soal.tipeSoal === TipeSoal.PILIHAN_GANDA) {
      const correctOpsi = soal.opsi.find(o => o.isCorrect);
      return correctOpsi?.id || "";
    }
    
    // For ISIAN_SINGKAT, we need the correct answer from opsi or pembahasan
    const correctOpsi = soal.opsi.find(o => o.isCorrect);
    return correctOpsi?.teks || "";
  };

  return (
    <div className="min-h-screen bg-bg-white font-['Poppins',sans-serif]">
      {/* Navbar */}
      <nav className="h-[70px] px-5 md:px-20 flex items-center bg-bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center">
            <ArrowLeft1 className="w-8 h-8" strokeWidth={1.5} />
          </button>
          <h1 className="text-xl font-medium">{subtest.name}</h1>
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
                <h2 className="text-xl font-medium mb-0.5">{subtest.name}</h2>
                <p className="text-xs text-gray-400">{soals.length} Soal | {subtest.duration} Menit</p>
              </div>

              {/* Correct Answers */}
              <div className="mb-5">
                <p className="text-xs text-gray-400">Jawaban benar</p>
                <p className="font-semibold text-3xl">{correctCount}/{soals.length}</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-5"></div>

              <QuestionNumbersAndBtn
                soals={soals}
                stateStyles={{
                  correct: "bg-[#35CA89]/50 text-gray-800",
                  incorrect: "bg-[#D75353]/50 text-gray-800",
                }}
                questionToStateFn={getQuestionStatus}
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
                {soals[currentQuestion - 1].question}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.2)] mb-5"></div>

              <QuestionInput
                soal={soals[currentQuestion - 1]}
                isReviewMode={true}
                userAnswer={getCurrentSoalAttempt()?.jawaban || ""}
                correctAnswer={getCorrectAnswer(soals[currentQuestion - 1])}
              />

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.2)] mb-5"></div>

              {/* Explanation */}
              <div>
                <h3 className="text-lg font-medium mb-2">Pembahasan</h3>
                <div className="text-base whitespace-pre-line">
                  {soals[currentQuestion - 1].pembahasanSoal?.pembahasan || "Tidak ada pembahasan untuk soal ini."}
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
                  disabled={currentQuestion === soals.length}
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
