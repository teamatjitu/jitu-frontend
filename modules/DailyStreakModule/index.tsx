"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Flame, Trophy, Calendar, Target, CheckCircle2 } from "lucide-react";
import {
  getDailyQuestion,
  getUserStreak,
  submitAnswer as submitAnswerApi,
  DailyQuestion as APIDailyQuestion,
} from "@/lib/api/DailyApi";
import { toast } from "sonner";

const DailyStreakModule = () => {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalProblemsSolved, setTotalProblemsSolved] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<APIDailyQuestion | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyData();
  }, []);

  const loadDailyData = async () => {
    try {
      setLoading(true);
      
      // Load streak data
      const streakData = await getUserStreak();
      setStreak(streakData.currentStreak);
      setBestStreak(streakData.bestStreak);
      setTotalProblemsSolved(streakData.totalProblemsSolved);

      // Load today's question
      const questionData = await getDailyQuestion();
      setCurrentProblem(questionData.question);
      setIsAnswered(questionData.alreadyAnswered);
      
      if (questionData.alreadyAnswered) {
        if (questionData.isCorrect !== undefined) {
          setIsCorrect(questionData.isCorrect);
        }
        if (questionData.userAnswer) {
          setSelectedAnswer(questionData.userAnswer);
        }
        // Fetch explanation if needed, but current API doesn't return it in getDailyQuestion for answered state.
        // We might need to assume it's shown or handled elsewhere.
        // For now, let's at least show the user's answer.
      }
    } catch (error) {
      console.error("Failed to load daily data:", error);
      toast.error("Gagal memuat data harian");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentProblem || !selectedAnswer) return;

    try {
      const result = await submitAnswerApi(currentProblem.id, selectedAnswer);
      
      if (result.success) {
        setIsCorrect(result.isCorrect || false);
        setIsAnswered(true);
        setExplanation(result.explanation || null);
        
        if (result.newStreak !== undefined) {
          setStreak(result.newStreak);
          setBestStreak(Math.max(bestStreak, result.newStreak));
        }
        
        if (result.isCorrect) {
          setTotalProblemsSolved(totalProblemsSolved + 1);
          toast.success("Jawaban benar! Streak kamu bertambah! 🔥");
        } else {
          toast.error("Jawaban salah. Coba lagi besok!");
        }
      } else {
        toast.error(result.message || "Gagal mengirim jawaban");
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      toast.error("Gagal mengirim jawaban");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pl-20 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat soal harian...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pl-20 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="pt-8 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Daily Streak</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Latih kemampuanmu setiap hari dan tingkatkan streak-mu! 🔥
          </p>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-orange-500 to-pink-500 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Current Streak</p>
                  <p className="text-3xl font-bold">{streak} hari</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Best Streak</p>
                  <p className="text-3xl font-bold">{bestStreak} hari</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-purple-500 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Problems Solved</p>
                  <p className="text-3xl font-bold">{totalProblemsSolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Problem */}
        <Card className="bg-white rounded-2xl shadow-lg border-2 border-orange-100">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-orange-50 to-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-500" />
                Soal Hari Ini
              </CardTitle>
              {isAnswered && (
                <div
                  className={`px-4 py-2 rounded-full font-semibold ${
                    isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isCorrect ? "✓ Benar!" : "✗ Salah"}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {currentProblem ? (
              <div className="space-y-6">
                {/* Question Image */}
                {currentProblem.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={currentProblem.imageUrl}
                      alt="Question"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Narration */}
                {currentProblem.narration && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4">
                    <p className="text-gray-700 italic">
                      {currentProblem.narration}
                    </p>
                  </div>
                )}

                {/* Question */}
                {currentProblem.content && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <p className="text-lg text-gray-900 leading-relaxed">
                      {currentProblem.content}
                    </p>
                  </div>
                )}

                {/* Question Content */}
                <div className="space-y-6">
                  {/* Options / Input */}
                  {currentProblem.type === "ISIAN_SINGKAT" ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="text"
                          className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-lg"
                          placeholder="Ketik jawaban Anda di sini..."
                          value={selectedAnswer || ""}
                          onChange={(e) => !isAnswered && setSelectedAnswer(e.target.value)}
                          disabled={isAnswered}
                        />
                      </div>
                      {isAnswered && (
                        <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {isCorrect ? <CheckCircle2 className="w-4 h-4"/> : null}
                          {isCorrect ? "Jawaban Anda Benar!" : "Jawaban Anda Salah."}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentProblem.options.map((option, index) => {
                        const isSelected = selectedAnswer === option.id;
                        // ... existing logic for options
                        const isCorrectAnswer = false; // Hidden
                        const isWrongAnswer = isAnswered && isSelected && !isCorrect;
                        const optionLabel = String.fromCharCode(65 + index);

                        return (
                          <button
                            key={option.id}
                            onClick={() =>
                              !isAnswered && setSelectedAnswer(option.id)
                            }
                            disabled={isAnswered}
                            className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                              isCorrectAnswer
                                ? "border-green-500 bg-green-50"
                                : isWrongAnswer
                                ? "border-red-500 bg-red-50"
                                : isSelected
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                            } ${
                              isAnswered
                                ? "cursor-not-allowed"
                                : "cursor-pointer hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                  isCorrectAnswer
                                    ? "bg-green-500 text-white"
                                    : isWrongAnswer
                                    ? "bg-red-500 text-white"
                                    : isSelected
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                              >
                                {optionLabel}
                              </div>
                              <span className="text-base text-gray-900 flex-1">
                                {option.content}
                              </span>
                              {isCorrectAnswer && (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                {!isAnswered && (
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-6 rounded-xl text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Jawaban
                  </Button>
                )}

                {/* Explanation */}
                {isAnswered && explanation && (
                  <Card className="bg-blue-50 border-2 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-blue-900 mb-3">
                        💡 Pembahasan
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {explanation}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Belum ada soal untuk hari ini</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar/History (Optional Enhancement) */}
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-900">
              Streak Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded ${
                    i < streak
                      ? "bg-gradient-to-br from-orange-500 to-pink-500"
                      : "bg-gray-200"
                  }`}
                  title={`Day ${i + 1}`}
                />
              ))}
            </div>
            <p className="text-center text-gray-600 mt-4">
              Keep your streak going! Come back tomorrow for a new challenge.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyStreakModule;
