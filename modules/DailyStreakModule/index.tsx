"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { dailyProblems } from "./payload";
import { DailyProblem } from "./interface";
import { Flame, Trophy, Calendar, Target, CheckCircle2 } from "lucide-react";

const DailyStreakModule = () => {
  const [streak, setStreak] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<DailyProblem | null>(
    null
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Get today's problem
    const today = new Date().toDateString();
    const problem = dailyProblems.find((p) => p.date === today);
    setCurrentProblem(problem || dailyProblems[0]); // Fallback to first problem

    // Load streak from localStorage
    const savedStreak = localStorage.getItem("dailyStreak");
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }

    // Check if already answered today
    const lastAnswered = localStorage.getItem("lastAnsweredDate");
    if (lastAnswered === today) {
      setIsAnswered(true);
    }
  }, []);

  const handleAnswerSubmit = () => {
    if (!currentProblem || !selectedAnswer) return;

    const correct = selectedAnswer === currentProblem.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("dailyStreak", newStreak.toString());
    }

    localStorage.setItem("lastAnsweredDate", new Date().toDateString());
  };

  const resetStreak = () => {
    setStreak(0);
    localStorage.setItem("dailyStreak", "0");
  };

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
                  <p className="text-3xl font-bold">
                    {Math.max(streak, 15)} hari
                  </p>
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
                  <p className="text-3xl font-bold">{streak * 3}</p>
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
                {/* Problem Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                    {currentProblem.subject}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    {currentProblem.difficulty}
                  </span>
                </div>

                {/* Question */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {currentProblem.question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentProblem.options.map((option, index) => {
                    const optionKey = String.fromCharCode(65 + index); // A, B, C, D
                    const isSelected = selectedAnswer === optionKey;
                    const isCorrectAnswer =
                      isAnswered && currentProblem.correctAnswer === optionKey;
                    const isWrongAnswer =
                      isAnswered && isSelected && !isCorrectAnswer;

                    return (
                      <button
                        key={optionKey}
                        onClick={() =>
                          !isAnswered && setSelectedAnswer(optionKey)
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
                            {optionKey}
                          </div>
                          <span className="text-base text-gray-900 flex-1">
                            {option}
                          </span>
                          {isCorrectAnswer && (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                      </button>
                    );
                  })}
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
                {isAnswered && (
                  <Card className="bg-blue-50 border-2 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-blue-900 mb-3">
                        💡 Pembahasan
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {currentProblem.explanation}
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
