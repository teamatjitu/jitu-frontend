import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft1, ArrowRight1, Check, Close } from "~/components/icons";
import { QuestionInput } from "./QuestionInput";

import { QuestionNumbersAndBtn } from "./QuestionNumbersAndBtn";
import { TipeSoal } from "../enums";

interface TryoutState {
  markedQuestions: Set<number>;
  timeRemaining: number;
}

function QI({
  soal,
  onAnswer,
  value,
}: {
  soal: Soal;
  onAnswer: (answer: number | string) => void;
  value: number | string;
}) {
  if (soal.tipeSoal === TipeSoal.BENAR_SALAH) {
    return (
      <>
        <div className="flex flex-col gap-2 mb-5">
          {/* True Option */}
          <button
            onClick={() => onAnswer(0)}
            className={`w-full cursor-pointer p-3 rounded-xl flex items-center gap-2 text-left text-base transition-all ${
              value === 0
                ? "border-2 border-blue-500 bg-[#4292FD]/10"
                : "border border-gray-300"
            }`}
          >
            <Check />
            <p>Benar</p>
          </button>

          {/* False Option */}
          <button
            onClick={() => onAnswer(1)}
            className={`w-full cursor-pointer p-3 rounded-xl flex items-center gap-2 text-left text-base transition-all ${
              value === 1
                ? "border-2 border-blue-500 bg-[#4292FD]/10"
                : "border border-gray-300"
            }`}
          >
            <Close />
            <p>Salah</p>
          </button>
        </div>
      </>
    );
  }

  if (soal.tipeSoal === TipeSoal.ISIAN_SINGKAT) {
    return (
      <div className="mb-5 w-full p-3 rounded-xl text-left text-base border border-gray-300">
        <input
          type="text"
          className="w-full bg-transparent outline-none"
          placeholder="Tuliskan jawaban anda di sini"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => {
            onAnswer(e.target.value);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mb-5">
      {soal.opsi.map((opsi, index) => (
        <button
          key={index}
          onClick={() => onAnswer(index)}
          className={`w-full p-3 rounded-xl text-left text-base transition-all ${
            value === index
              ? "border-2 border-blue-500 bg-[#4292FD]/10"
              : "border border-gray-300"
          }`}
        >
          {opsi.teks}
        </button>
      ))}
    </div>
  );
}

export function TryoutAttemptView({ tryout }: { tryout: Tryout }) {
  const [tryoutState, setTryoutState] = useState<TryoutState>({
    markedQuestions: new Set([4]),
    timeRemaining: tryout.duration,
  });

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answerStates, setAnswerStates] = useState<
    Record<number, number | string>
  >({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTryoutState((prev) => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(secs).padStart(2, "0"),
    };
  };

  const time = formatTime(tryoutState.timeRemaining);

  const clearAnswer = () => {
    setAnswerStates((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion];
      return newAnswers;
    });
  };

  const toggleMark = () => {
    setTryoutState((prev) => {
      const newMarked = new Set(prev.markedQuestions);
      if (newMarked.has(currentQuestion)) {
        newMarked.delete(currentQuestion);
      } else {
        newMarked.add(currentQuestion);
      }
      return { ...prev, markedQuestions: newMarked };
    });
  };

  const goToQuestion = (questionNum: number) => {
    setCurrentQuestion(questionNum);
  };

  const nextQuestion = () => {
    if (currentQuestion < tryout.soal.length) {
      goToQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 1) {
      goToQuestion(currentQuestion - 1);
    }
  };

  const getQuestionStatus = (questionNum: number) => {
    if (tryoutState.markedQuestions.has(questionNum)) return "marked";

    if (
      answerStates[questionNum] !== undefined &&
      answerStates[questionNum] !== ""
    )
      return "answered";

    return "unanswered";
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
                <p className="text-xs text-gray-400">
                  {tryout.soal.length} Soal | {tryout.duration} Menit
                </p>
              </div>

              {/* Timer */}
              <div className="flex justify-center items-center gap-1 mb-5 select-none">
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-medium">{time.hours}</span>
                </div>
                <span className="text-xl font-medium">:</span>
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-medium">{time.minutes}</span>
                </div>
                <span className="text-xl font-medium">:</span>
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-medium">{time.seconds}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-5"></div>

              <div className="hidden lg:block">
                <QuestionNumbersAndBtn
                  tryout={tryout}
                  stateStyles={{
                    marked: "bg-yellow-50 text-gray-800",
                    unanswered: "bg-gray-100 text-black",
                    answered: "bg-blue-50 text-gray-700",
                  }}
                  questionToStateFn={getQuestionStatus}
                  currentQuestion={currentQuestion}
                  onQuestionNumberClick={goToQuestion}
                  btnElement={
                    <Button variant="blue" size="lg" className="w-full">
                      Selesai Mengerjakan
                    </Button>
                  }
                />
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 shadow-[0_0_4px_rgba(0,0,0,0.15)] mb-4">
              {/* Question Text */}
              <div className="text-lg mb-5 whitespace-pre-line">
                {tryout.soal[currentQuestion - 1].question}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.2)] mb-5"></div>

              {/* Options */}
              <QuestionInput
                soal={tryout.soal[currentQuestion - 1]}
                onAnswer={(val) => {
                  setAnswerStates((prev) => ({
                    ...prev,
                    [currentQuestion]: val,
                  }));
                }}
                userAnswer={answerStates[currentQuestion]}
              />

              {/* Clear Answer */}
              <button
                onClick={clearAnswer}
                className="text-sm text-error hover:underline cursor-pointer"
              >
                Hapus jawaban
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <Button
                onClick={toggleMark}
                variant="transparentBlack"
                size="lg"
                className={`px-4 py-3 w-48 h-12 border-yellow-800 text-yellow-800 hover:border-yellow-800 hover:bg-yellow-800 hover:text-white`}
              >
                Tandai soal
              </Button>

              <div className="flex gap-2">
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
                  disabled={currentQuestion === tryout.soal.length}
                  className="w-[92px] h-[48px] px-4 py-3"
                >
                  <ArrowRight1 />
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:hidden rounded-xl p-6 shadow-[0_0_4px_rgba(0,0,0,0.15)]">
            <QuestionNumbersAndBtn
              tryout={tryout}
              stateStyles={{
                marked: "bg-yellow-50 text-gray-800",
                unanswered: "bg-gray-100 text-black",
                answered: "bg-blue-50 text-gray-700",
              }}
              questionToStateFn={getQuestionStatus}
              currentQuestion={currentQuestion}
              onQuestionNumberClick={goToQuestion}
              btnElement={
                <Button variant="blue" size="lg" className="w-full">
                  Selesai Mengerjakan
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
