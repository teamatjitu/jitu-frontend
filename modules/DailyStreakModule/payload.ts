import { DailyProblem } from "./interface";

export const dailyProblems: DailyProblem[] = [
  {
    id: 1,
    date: new Date().toDateString(),
    subject: "Literasi Bahasa Indonesia",
    difficulty: "Medium",
    question:
      "Manakah di antara kalimat berikut yang merupakan kalimat efektif?",
    options: [
      "Budi adalah merupakan seorang anak yang pintar.",
      "Meskipun lelah, tetapi dia tetap melanjutkan pekerjaannya.",
      "Para hadirin dimohon untuk duduk kembali.",
      "Dia menjelaskan tentang masalah itu secara rinci.",
    ],
    correctAnswer: "C",
    explanation:
      "Kalimat C adalah kalimat efektif karena tidak mengandung pleonasme (pengulangan kata yang bermakna sama) dan tidak memiliki kontradiksi konjungsi. Kalimat A mengandung pleonasme 'adalah merupakan', kalimat B memiliki kontradiksi konjungsi 'meskipun...tetapi', dan kalimat D mengandung pleonasme 'menjelaskan tentang'.",
  },
  {
    id: 2,
    date: new Date(Date.now() - 86400000).toDateString(), // Yesterday
    subject: "Penalaran Matematika",
    difficulty: "Hard",
    question:
      "Jika f(x) = 2x + 3 dan g(x) = x² - 1, maka nilai (f ∘ g)(2) adalah...",
    options: ["9", "11", "13", "15"],
    correctAnswer: "A",
    explanation:
      "(f ∘ g)(2) = f(g(2)). Pertama hitung g(2) = 2² - 1 = 3. Kemudian f(3) = 2(3) + 3 = 9. Jadi jawabannya adalah 9.",
  },
  {
    id: 3,
    date: new Date(Date.now() - 172800000).toDateString(), // 2 days ago
    subject: "Literasi Bahasa Inggris",
    difficulty: "Easy",
    question: "What is the synonym of 'beautiful'?",
    options: ["Ugly", "Pretty", "Bad", "Terrible"],
    correctAnswer: "B",
    explanation:
      "'Pretty' is a synonym of 'beautiful', both meaning attractive or pleasing to look at. The other options are antonyms or unrelated words.",
  },
  {
    id: 4,
    date: new Date(Date.now() - 259200000).toDateString(), // 3 days ago
    subject: "Penalaran Umum",
    difficulty: "Medium",
    question:
      "Semua mahasiswa rajin. Beberapa mahasiswa adalah atlet. Kesimpulan yang tepat adalah...",
    options: [
      "Semua atlet adalah mahasiswa",
      "Beberapa atlet rajin",
      "Tidak ada atlet yang rajin",
      "Semua atlet rajin",
    ],
    correctAnswer: "B",
    explanation:
      "Karena beberapa mahasiswa adalah atlet dan semua mahasiswa rajin, maka dapat disimpulkan bahwa beberapa atlet (yang merupakan mahasiswa) pasti rajin.",
  },
  {
    id: 5,
    date: new Date(Date.now() - 345600000).toDateString(), // 4 days ago
    subject: "Pengetahuan Kuantitatif",
    difficulty: "Hard",
    question: "Berapakah nilai x yang memenuhi persamaan 3x² - 12x + 9 = 0?",
    options: [
      "x = 1 atau x = 3",
      "x = 2 atau x = 4",
      "x = -1 atau x = -3",
      "x = 0 atau x = 3",
    ],
    correctAnswer: "A",
    explanation:
      "3x² - 12x + 9 = 0 dapat difaktorkan menjadi 3(x² - 4x + 3) = 0, atau 3(x - 1)(x - 3) = 0. Sehingga x = 1 atau x = 3.",
  },
];
