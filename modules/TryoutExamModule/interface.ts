export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer?: number; // 0-based index
}

export interface ExamState {
  currentQuestionIndex: number;
  answers: { [questionId: number]: number }; // questionId -> selected option index
  markedQuestions: number[]; // question IDs that are marked for review
  timeRemaining: number; // in seconds
}

export interface SubtestExam {
  subtestId: number;
  subtestName: string;
  tryoutId: number;
  tryoutTitle: string;
  duration: number; // in minutes
  questions: Question[];
}
