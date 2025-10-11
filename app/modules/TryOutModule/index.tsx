import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft1, ArrowRight1 } from "~/components/icons";

interface TryoutState {
  currentQuestion: number;
  answers: Record<number, number>;
  markedQuestions: Set<number>;
  timeRemaining: number;
}

export const TryOutModule = ({ tryout }: { tryout: Tryout }) => {
  const [tryoutState, setTryoutState] = useState<TryoutState>({
    currentQuestion: 1,
    answers: {},
    markedQuestions: new Set([4]),
    timeRemaining: tryout.duration,
  });

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

  const selectAnswer = (optionIndex: number) => {
    setTryoutState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentQuestion]: optionIndex },
    }));
  };

  const clearAnswer = () => {
    setTryoutState((prev) => {
      const newAnswers = { ...prev.answers };
      delete newAnswers[prev.currentQuestion];
      return { ...prev, answers: newAnswers };
    });
  };

  const toggleMark = () => {
    setTryoutState((prev) => {
      const newMarked = new Set(prev.markedQuestions);
      if (newMarked.has(prev.currentQuestion)) {
        newMarked.delete(prev.currentQuestion);
      } else {
        newMarked.add(prev.currentQuestion);
      }
      return { ...prev, markedQuestions: newMarked };
    });
  };

  const goToQuestion = (questionNum: number) => {
    setTryoutState((prev) => ({ ...prev, currentQuestion: questionNum }));
  };

  const nextQuestion = () => {
    if (tryoutState.currentQuestion < tryout.soal.length) {
      goToQuestion(tryoutState.currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (tryoutState.currentQuestion > 1) {
      goToQuestion(tryoutState.currentQuestion - 1);
    }
  };

  const getQuestionStatus = (questionNum: number) => {
    let state = "";
    if (questionNum === tryoutState.currentQuestion) state = "current-";

    if (tryoutState.markedQuestions.has(questionNum)) {
      state += "marked";
    } else if (tryoutState.answers[questionNum] !== undefined) {
      state += "answered";
    } else {
      state += "unanswered";
    }

    return state;
  };

  function QuestionNumbersAndDoneButton() {
    return (
      <>
        {/* Question Numbers */}
        <div className="flex flex-wrap gap-2 mb-5">
          {Array.from({ length: tryout.soal.length }, (_, i) => i + 1).map(
            (num) => {
              const status = getQuestionStatus(num);
              return (
                <button
                  key={num}
                  onClick={() => goToQuestion(num)}
                  className={`w-[45.6px] h-[45.6px] rounded-lg flex items-center justify-center text-base transition-all ${
                    status.startsWith("current")
                      ? "border-2 border-blue-500"
                      : ""
                  } ${
                    status.endsWith("marked")
                      ? "bg-yellow-50 text-gray-800"
                      : status.endsWith("unanswered")
                        ? "bg-gray-100 text-black"
                        : "bg-blue-50 text-gray-700"
                  }`}
                >
                  {num}
                </button>
              );
            }
          )}
        </div>

        {/* Finish Button */}
        <Button variant="blue" size="lg" className="w-full">
          Selesai Mengerjakan
        </Button>
      </>
    )
  }

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
                <p className="text-xs text-gray-400">30 Soal | 30 Menit</p>
              </div>

              {/* Timer */}
              <div className="flex justify-center items-center gap-1 mb-5">
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
                <QuestionNumbersAndDoneButton />
              </div>
            </div>
          </div>

          {/* Main Question Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 shadow-[0_0_4px_rgba(0,0,0,0.15)] mb-4">
              {/* Question Text */}
              <div className="text-lg mb-5 whitespace-pre-line">
                {tryout.soal[tryoutState.currentQuestion-1].question}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.2)] mb-5"></div>

              {/* Options */}
              <div className="flex flex-col gap-2 mb-5">
                {tryout.soal[tryoutState.currentQuestion-1].opsi.map((opsi, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full p-3 rounded-xl text-left text-base transition-all ${
                      tryoutState.answers[tryoutState.currentQuestion] === index
                        ? "border-2 border-blue-500 bg-[#4292FD]/10"
                        : "border border-gray-300"
                    }`}
                  >
                    {opsi.teks}
                  </button>
                ))}
              </div>

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
                  disabled={tryoutState.currentQuestion === 1}
                  className="w-[92px] h-[48px] px-4 py-3"
                >
                  <ArrowLeft1 className="text-gray-700"/>
                </Button>

                <Button
                  onClick={nextQuestion}
                  variant="transparentBlack"
                  size="lg"
                  disabled={tryoutState.currentQuestion === tryout.soal.length}
                  className="w-[92px] h-[48px] px-4 py-3"
                >
                  <ArrowRight1/>
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:hidden rounded-xl p-6 shadow-[0_0_4px_rgba(0,0,0,0.15)]">
              <QuestionNumbersAndDoneButton />
          </div>
        </div>
      </div>
    </div>
  );
};
