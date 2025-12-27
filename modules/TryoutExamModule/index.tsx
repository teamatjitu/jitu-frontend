"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, ChevronLeft, Flag } from "lucide-react";
import { SubtestExam, ExamState } from "./interface";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TryoutExamModuleProps {
  examData: SubtestExam;
}

const TryoutExamModule = ({ examData }: TryoutExamModuleProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get("review") === "true";

  // Generate mock user answers for review mode (some correct, some wrong)
  const generateMockUserAnswers = () => {
    const answers: { [key: number]: number } = {};
    examData.questions.forEach((question, index) => {
      // Make some answers correct, some wrong for demonstration
      if (index % 3 === 0) {
        // Every 3rd question: correct answer
        answers[question.id] = question.correctAnswer;
      } else if (index % 3 === 1) {
        // Every 3rd + 1 question: wrong answer
        answers[question.id] = (question.correctAnswer + 1) % 5;
      } else {
        // Every 3rd + 2 question: another wrong answer
        answers[question.id] = (question.correctAnswer + 2) % 5;
      }
    });
    return answers;
  };

  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: isReviewMode ? generateMockUserAnswers() : {},
    markedQuestions: [],
    timeRemaining: examData.duration * 60, // Convert minutes to seconds
  });

  // Timer (disabled in review mode)
  useEffect(() => {
    if (isReviewMode) return; // Don't run timer in review mode

    const timer = setInterval(() => {
      setExamState((prev) => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          handleFinish();
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isReviewMode]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(
      2,
      "0"
    )} : ${String(secs).padStart(2, "0")}`;
  };

  const currentQuestion = examData.questions[examState.currentQuestionIndex];

  const handleAnswerSelect = (optionIndex: number) => {
    if (isReviewMode) return; // Disable answer selection in review mode
    setExamState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: optionIndex,
      },
    }));
  };

  const handleMarkQuestion = () => {
    setExamState((prev) => {
      const isMarked = prev.markedQuestions.includes(currentQuestion.id);
      return {
        ...prev,
        markedQuestions: isMarked
          ? prev.markedQuestions.filter((id) => id !== currentQuestion.id)
          : [...prev.markedQuestions, currentQuestion.id],
      };
    });
  };

  const handleQuestionNavigate = (index: number) => {
    setExamState((prev) => ({ ...prev, currentQuestionIndex: index }));
  };

  const handlePrevious = () => {
    if (examState.currentQuestionIndex > 0) {
      handleQuestionNavigate(examState.currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (examState.currentQuestionIndex < examData.questions.length - 1) {
      handleQuestionNavigate(examState.currentQuestionIndex + 1);
    }
  };

  const handleFinish = () => {
    // Save answers and navigate back
    // In real app, submit to backend
    alert("Try out selesai! Jawaban Anda telah tersimpan.");
    router.back();
  };

  const getQuestionStatus = (questionId: number, index: number) => {
    const isAnswered = examState.answers[questionId] !== undefined;
    const isMarked = examState.markedQuestions.includes(questionId);
    const isCurrent = examState.currentQuestionIndex === index;

    // In review mode, check if answer is correct or incorrect
    if (isReviewMode && isAnswered) {
      const question = examData.questions.find((q) => q.id === questionId);
      if (question) {
        const isCorrect =
          examState.answers[questionId] === question.correctAnswer;
        if (isCurrent) return "current-review";
        return isCorrect ? "correct" : "incorrect";
      }
    }

    if (isCurrent) return "current";
    if (isMarked) return "marked";
    if (isAnswered) return "answered";
    return "unanswered";
  };

  const getQuestionButtonClass = (status: string) => {
    switch (status) {
      case "current":
        return "bg-yellow-400 text-gray-900 ring-4 ring-yellow-200";
      case "current-review":
        return "bg-yellow-400 text-gray-900 ring-4 ring-yellow-200";
      case "correct":
        return "bg-emerald-500 text-white hover:bg-emerald-600";
      case "incorrect":
        return "bg-red-500 text-white hover:bg-red-600";
      case "marked":
        return "bg-red-400 text-white";
      case "answered":
        return "bg-blue-400 text-white";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  const answeredCount = Object.keys(examState.answers).length;
  const unansweredCount = examData.questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              Kembali
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-bold text-gray-900">
              {examData.tryoutTitle} - {examData.subtestName}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Question Navigation */}
          <div className="lg:col-span-3">
            <Card className="sticky top-20 bg-white shadow-sm">
              <CardContent className="p-6">
                {/* Subtest Info */}
                <div className="mb-4">
                  <h2 className="font-bold text-gray-900 mb-1">
                    {examData.subtestName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {examData.questions.length} Soal | {examData.duration} Menit
                  </p>
                </div>

                {/* Timer (hidden in review mode) */}
                {!isReviewMode && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold mb-1">
                      Waktu Tersisa
                    </p>
                    <div className="text-2xl font-mono font-bold text-blue-900">
                      {formatTime(examState.timeRemaining)}
                    </div>
                  </div>
                )}

                {/* Question Grid */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Navigasi Soal
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {examData.questions.map((question, index) => {
                      const status = getQuestionStatus(question.id, index);
                      return (
                        <button
                          key={question.id}
                          onClick={() => handleQuestionNavigate(index)}
                          className={`w-full aspect-square rounded-lg font-semibold text-sm transition-all ${getQuestionButtonClass(
                            status
                          )}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button (hidden in review mode) */}
                {!isReviewMode && (
                  <Button
                    onClick={handleFinish}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-xl font-bold text-base shadow-lg"
                  >
                    Selesai Mengerjakan
                  </Button>
                )}

                {/* Review Mode Info */}
                {isReviewMode && (
                  <>
                    <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                      <p className="text-sm text-emerald-800 font-semibold text-center">
                        Mode Pembahasan
                      </p>
                      <p className="text-xs text-emerald-700 text-center mt-1">
                        Lihat kunci jawaban dan pembahasan
                      </p>
                    </div>

                    {/* Review Stats */}
                    <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Hasil Pengerjaan
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-emerald-500"></div>
                            <span className="text-gray-600">Benar:</span>
                          </div>
                          <span className="font-semibold text-emerald-600">
                            {
                              examData.questions.filter(
                                (q) =>
                                  examState.answers[q.id] === q.correctAnswer
                              ).length
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-500"></div>
                            <span className="text-gray-600">Salah:</span>
                          </div>
                          <span className="font-semibold text-red-600">
                            {
                              examData.questions.filter(
                                (q) =>
                                  examState.answers[q.id] !== undefined &&
                                  examState.answers[q.id] !== q.correctAnswer
                              ).length
                            }
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">
                              Skor:
                            </span>
                            <span className="font-bold text-blue-600 text-lg">
                              {Math.round(
                                (examData.questions.filter(
                                  (q) =>
                                    examState.answers[q.id] === q.correctAnswer
                                ).length /
                                  examData.questions.length) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Stats (hidden in review mode) */}
                {!isReviewMode && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Terjawab:</span>
                      <span className="font-semibold text-blue-600">
                        {answeredCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Belum Dijawab:</span>
                      <span className="font-semibold text-gray-700">
                        {unansweredCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ditandai:</span>
                      <span className="font-semibold text-red-600">
                        {examState.markedQuestions.length}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Question */}
          <div className="lg:col-span-9">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-8">
                {/* Question Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      Soal {examState.currentQuestionIndex + 1}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {examState.currentQuestionIndex + 1} dari{" "}
                      {examData.questions.length}
                    </div>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${
                          ((examState.currentQuestionIndex + 1) /
                            examData.questions.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-6">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                    {currentQuestion.questionText}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, index) => {
                    const userAnswer = examState.answers[currentQuestion.id];
                    const isUserAnswer = userAnswer === index;
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const isUserCorrect =
                      isReviewMode && isUserAnswer && isCorrect;
                    const isUserWrong =
                      isReviewMode && isUserAnswer && !isCorrect;
                    const isCorrectAnswer =
                      isReviewMode && isCorrect && !isUserAnswer;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={isReviewMode}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          isUserCorrect
                            ? "border-emerald-500 bg-emerald-50 shadow-md"
                            : isUserWrong
                            ? "border-red-500 bg-red-50 shadow-md"
                            : isCorrectAnswer
                            ? "border-emerald-500 bg-emerald-50/50 shadow-md"
                            : isUserAnswer
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        } ${isReviewMode ? "cursor-default" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isUserCorrect
                                  ? "border-emerald-500 bg-emerald-500"
                                  : isUserWrong
                                  ? "border-red-500 bg-red-500"
                                  : isCorrectAnswer
                                  ? "border-emerald-500 bg-emerald-500"
                                  : isUserAnswer
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {(isUserAnswer ||
                                isCorrectAnswer ||
                                isUserCorrect) && (
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span
                              className={`text-base ${
                                isUserCorrect
                                  ? "text-emerald-900 font-medium"
                                  : isUserWrong
                                  ? "text-red-900 font-medium"
                                  : isCorrectAnswer
                                  ? "text-emerald-900 font-medium"
                                  : isUserAnswer
                                  ? "text-blue-900 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {option}
                            </span>
                          </div>
                          {isReviewMode && (
                            <div className="flex items-center gap-2">
                              {isUserCorrect && (
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white">
                                  ✓ Jawaban Kamu (Benar)
                                </span>
                              )}
                              {isUserWrong && (
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-600 text-white">
                                  ✗ Jawaban Kamu (Salah)
                                </span>
                              )}
                              {isCorrectAnswer && (
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white">
                                  ✓ Jawaban Benar
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Solution (only in review mode) */}
                {isReviewMode && currentQuestion.solution && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {currentQuestion.solution}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  {!isReviewMode && (
                    <Button
                      onClick={handleMarkQuestion}
                      variant="outline"
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        examState.markedQuestions.includes(currentQuestion.id)
                          ? "border-red-500 text-red-600 bg-red-50"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      {examState.markedQuestions.includes(currentQuestion.id)
                        ? "Tandai soal"
                        : "Tandai soal"}
                    </Button>
                  )}
                  {isReviewMode && <div></div>}

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handlePrevious}
                      disabled={examState.currentQuestionIndex === 0}
                      variant="outline"
                      className="px-6 py-3 rounded-xl font-semibold border-gray-300 disabled:opacity-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Sebelumnya
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={
                        examState.currentQuestionIndex ===
                        examData.questions.length - 1
                      }
                      className="px-6 py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                    >
                      Selanjutnya
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryoutExamModule;
