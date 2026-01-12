export interface DailyProblem {
  id: number;
  date: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}
