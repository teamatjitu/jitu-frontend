"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { dailyProblems } from "@/modules/DailyStreakModule/payload";

const DailyStreak = () => {
  const [streak, setStreak] = useState(0);
  const [answeredToday, setAnsweredToday] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<any | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const storedStreak = localStorage.getItem("dailyStreak");
    const lastAnsweredDate = localStorage.getItem("lastAnsweredDate");
    const today = new Date().toISOString().split("T")[0];

    if (storedStreak) {
      setStreak(parseInt(storedStreak, 10));
    }

    if (lastAnsweredDate === today) {
      setAnsweredToday(true);
    } else {
      // It's a new day, so reset answered status
      setAnsweredToday(false);
      // If they missed a day, reset the streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (
        lastAnsweredDate &&
        lastAnsweredDate !== yesterday.toISOString().split("T")[0]
      ) {
        setStreak(0);
        localStorage.setItem("dailyStreak", "0");
      }
    }

    // Set a random problem for the day if not answered
    if (!answeredToday) {
      const randomIndex = Math.floor(Math.random() * dailyProblems.length);
      setCurrentProblem(dailyProblems[randomIndex]);
    }
  }, []);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentProblem) return;

    const isCorrect = selectedAnswer === currentProblem.answer;
    let newStreak = streak;

    if (isCorrect) {
      newStreak = streak + 1;
      setStreak(newStreak);
    } else {
      newStreak = 0;
      setStreak(0);
    }

    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("dailyStreak", newStreak.toString());
    localStorage.setItem("lastAnsweredDate", today);
    setAnsweredToday(true);
    setShowResult(true);
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm p-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Daily Streak</span>
          <span className="text-lg font-bold text-yellow-500">🔥 {streak}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {answeredToday ? (
          <div className="text-center text-gray-500">
            <p>You've completed your daily problem!</p>
            <p>Come back tomorrow to continue your streak.</p>
          </div>
        ) : (
          currentProblem && (
            <div>
              <p className="font-semibold mb-4">{currentProblem.question}</p>
              <div className="flex flex-col space-y-2">
                {currentProblem.options.map((option: any, index: number) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "primary" : "outline"}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full justify-start text-left h-auto whitespace-normal ${
                      showResult && index === currentProblem.answer
                        ? "bg-green-200 border-green-500"
                        : ""
                    } ${
                      showResult &&
                      selectedAnswer === index &&
                      index !== currentProblem.answer
                        ? "bg-red-200 border-red-500"
                        : ""
                    }`}
                    disabled={showResult}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleAnswerSubmit}
                className="mt-4 w-full"
                disabled={selectedAnswer === null || showResult}
              >
                Submit
              </Button>
              {showResult && (
                <p className="mt-4 text-center font-bold">
                  {selectedAnswer === currentProblem.answer
                    ? "Correct! 🎉"
                    : "Incorrect. Keep trying! 💪"}
                </p>
              )}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default DailyStreak;
