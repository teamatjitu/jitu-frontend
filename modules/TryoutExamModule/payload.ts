import { SubtestExam } from "./interface";

// Mock questions - using "Meong ipsum" as shown in the reference
const generateMockQuestions = (count: number, startId: number = 1) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    questionText: `Meong ipsum dolor sit amet, consectetur adipiscing elit. Meong felis sit amet felis pulvinar, tincidunt felis meong. Purrr meong curabitur tristique felis vel felis posuere, ac vulputate meong felis vehicula. Sed do meong eiusmod tempor incididunt ut labore et dolore meong magna aliqua.\n\nUt enim ad minim meong veniam, quis nostrud exercitation meong ullamco laboris nisi ut aliquip ex ea meong commodo consequat. Meong duis aute irure dolor in meong reprehenderit in voluptate velit esse meong cillum dolore eu fugiat nulla meong pariatur.`,
    options: [
      "Meong ipsum",
      "Meong ipsum",
      "Meong ipsum",
      "Meong ipsum",
      "Meong ipsum",
    ],
    correctAnswer: Math.floor(Math.random() * 5), // Random correct answer for demo
  }));
};

export const subtestExams: { [key: string]: SubtestExam } = {
  // Tryout 1 - Subtest 1 (TPS)
  "1-1": {
    subtestId: 1,
    subtestName: "Tes Potensi Skolastik",
    tryoutId: 1,
    tryoutTitle: "Try Out UTBK SNBT 4 2026",
    duration: 110,
    questions: generateMockQuestions(90, 1),
  },
  // Tryout 1 - Subtest 2 (Literasi)
  "1-2": {
    subtestId: 2,
    subtestName: "Tes Literasi",
    tryoutId: 1,
    tryoutTitle: "Try Out UTBK SNBT 4 2026",
    duration: 85,
    questions: generateMockQuestions(60, 91),
  },
  // Tryout 2 - Subtest 1 (TPS)
  "2-1": {
    subtestId: 1,
    subtestName: "Tes Potensi Skolastik",
    tryoutId: 2,
    tryoutTitle: "Try Out UTBK SNBT 3 2026",
    duration: 110,
    questions: generateMockQuestions(90, 1),
  },
  // Tryout 2 - Subtest 2 (Literasi)
  "2-2": {
    subtestId: 2,
    subtestName: "Tes Literasi",
    tryoutId: 2,
    tryoutTitle: "Try Out UTBK SNBT 3 2026",
    duration: 85,
    questions: generateMockQuestions(60, 91),
  },
  // Tryout 3 - Subtest 1 (TPS)
  "3-1": {
    subtestId: 1,
    subtestName: "Tes Potensi Skolastik",
    tryoutId: 3,
    tryoutTitle: "Try Out UTBK SNBT 2 2026",
    duration: 110,
    questions: generateMockQuestions(90, 1),
  },
  // Tryout 3 - Subtest 2 (Literasi)
  "3-2": {
    subtestId: 2,
    subtestName: "Tes Literasi",
    tryoutId: 3,
    tryoutTitle: "Try Out UTBK SNBT 2 2026",
    duration: 85,
    questions: generateMockQuestions(60, 91),
  },
  // Tryout 4 - Subtest 1 (TPS)
  "4-1": {
    subtestId: 1,
    subtestName: "Tes Potensi Skolastik",
    tryoutId: 4,
    tryoutTitle: "Try Out UTBK SNBT 1 2026",
    duration: 110,
    questions: generateMockQuestions(90, 1),
  },
  // Tryout 4 - Subtest 2 (Literasi)
  "4-2": {
    subtestId: 2,
    subtestName: "Tes Literasi",
    tryoutId: 4,
    tryoutTitle: "Try Out UTBK SNBT 1 2026",
    duration: 85,
    questions: generateMockQuestions(60, 91),
  },
  // Tryout 5 - Subtest 1 (TPS)
  "5-1": {
    subtestId: 1,
    subtestName: "Tes Potensi Skolastik",
    tryoutId: 5,
    tryoutTitle: "Try Out UTBK SNBT 14 2025",
    duration: 110,
    questions: generateMockQuestions(90, 1),
  },
  // Tryout 5 - Subtest 2 (Literasi)
  "5-2": {
    subtestId: 2,
    subtestName: "Tes Literasi",
    tryoutId: 5,
    tryoutTitle: "Try Out UTBK SNBT 14 2025",
    duration: 85,
    questions: generateMockQuestions(60, 91),
  },
  // Tryout 6 - Subtest 1 (TPS)
  "6-1": {
    subtestId: 1,
    subtestName: "Tes Potensi Skolastik",
    tryoutId: 6,
    tryoutTitle: "Try Out UTBK SNBT 13 2025",
    duration: 110,
    questions: generateMockQuestions(90, 1),
  },
  // Tryout 6 - Subtest 2 (Literasi)
  "6-2": {
    subtestId: 2,
    subtestName: "Tes Literasi",
    tryoutId: 6,
    tryoutTitle: "Try Out UTBK SNBT 13 2025",
    duration: 85,
    questions: generateMockQuestions(60, 91),
  },
};

export const getSubtestExam = (
  tryoutId: number,
  subtestId: number
): SubtestExam | undefined => {
  const key = `${tryoutId}-${subtestId}`;
  return subtestExams[key];
};
