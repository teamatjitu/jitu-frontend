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

// Helper function to generate all 7 subtests for a tryout
const generateTryoutSubtests = (tryoutId: number, tryoutTitle: string) => {
  return {
    [`${tryoutId}-1`]: {
      subtestId: 1,
      subtestName: "Penalaran Umum",
      tryoutId,
      tryoutTitle,
      duration: 30,
      questions: generateMockQuestions(30, 1),
    },
    [`${tryoutId}-2`]: {
      subtestId: 2,
      subtestName: "Pengetahuan dan Pemahaman Umum",
      tryoutId,
      tryoutTitle,
      duration: 15,
      questions: generateMockQuestions(20, 31),
    },
    [`${tryoutId}-3`]: {
      subtestId: 3,
      subtestName: "Kemampuan Memahami Bacaan dan Menulis",
      tryoutId,
      tryoutTitle,
      duration: 25,
      questions: generateMockQuestions(20, 51),
    },
    [`${tryoutId}-4`]: {
      subtestId: 4,
      subtestName: "Pengetahuan Kuantitatif",
      tryoutId,
      tryoutTitle,
      duration: 20,
      questions: generateMockQuestions(20, 71),
    },
    [`${tryoutId}-5`]: {
      subtestId: 5,
      subtestName: "Literasi dalam Bahasa Indonesia",
      tryoutId,
      tryoutTitle,
      duration: 43,
      questions: generateMockQuestions(30, 91),
    },
    [`${tryoutId}-6`]: {
      subtestId: 6,
      subtestName: "Literasi dalam Bahasa Inggris",
      tryoutId,
      tryoutTitle,
      duration: 20,
      questions: generateMockQuestions(20, 121),
    },
    [`${tryoutId}-7`]: {
      subtestId: 7,
      subtestName: "Penalaran Matematika",
      tryoutId,
      tryoutTitle,
      duration: 43,
      questions: generateMockQuestions(20, 141),
    },
  };
};

export const subtestExams: { [key: string]: SubtestExam } = {
  ...generateTryoutSubtests(1, "Try Out UTBK SNBT 4 2026"),
  ...generateTryoutSubtests(2, "Try Out UTBK SNBT 3 2026"),
  ...generateTryoutSubtests(3, "Try Out UTBK SNBT 2 2026"),
  ...generateTryoutSubtests(4, "Try Out UTBK SNBT 1 2026"),
  ...generateTryoutSubtests(5, "Try Out UTBK SNBT 14 2025"),
  ...generateTryoutSubtests(6, "Try Out UTBK SNBT 13 2025"),
};

export const getSubtestExam = (
  tryoutId: number,
  subtestId: number
): SubtestExam | undefined => {
  const key = `${tryoutId}-${subtestId}`;
  return subtestExams[key];
};
