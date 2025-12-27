import {
  Brain,
  Globe,
  BookOpen,
  Calculator,
  FileText,
  Languages,
  BarChart3,
  Award,
} from "lucide-react";
import { TryOutCard, Stat, Subject } from "./interface";

export const tryOutData = [
  {
    id: 1,
    title: "Try Out UTBK SNBT 4 2026",
    number: "4",
    canEdit: true,
    participants: 375,
    badge: "SNBT",
  },
  {
    id: 2,
    title: "Try Out UTBK SNBT 3 2026",
    number: "3",
    canEdit: true,
    participants: 18048,
    badge: "SNBT",
  },
  {
    id: 3,
    title: "Try Out UTBK SNBT 2 2026",
    number: "2",
    canEdit: true,
    participants: 21712,
    badge: "SNBT",
  },
  {
    id: 4,
    title: "Try Out UTBK SNBT 1 2026",
    number: "1",
    canEdit: true,
    participants: 30229,
    badge: "SNBT",
  },
  {
    id: 5,
    title: "Try Out UTBK SNBT 14 2025",
    number: "14",
    canEdit: true,
    participants: 188475,
    badge: "SNBT",
  },
  {
    id: 6,
    title: "Try Out UTBK SNBT 13 2025",
    number: "13",
    canEdit: true,
    participants: 156521,
    badge: "SNBT",
  },
];

export const subjects = [
  {
    id: 1,
    title: "Penalaran Umum",
    icon: Brain,
    gradient: "from-purple-400 to-purple-600",
    count: 150,
  },
  {
    id: 2,
    title: "Pengetahuan dan Pemahaman Umum",
    icon: Globe,
    gradient: "from-blue-400 to-blue-600",
    count: 230,
  },
  {
    id: 3,
    title: "Kemampuan Memahami Bacaan dan Menulis",
    icon: BookOpen,
    gradient: "from-green-400 to-green-600",
    count: 189,
  },
  {
    id: 4,
    title: "Pengetahuan Kuantitatif",
    icon: Calculator,
    gradient: "from-red-400 to-red-600",
    count: 275,
  },
  {
    id: 5,
    title: "Literasi dalam Bahasa Indonesia",
    icon: FileText,
    gradient: "from-yellow-400 to-orange-500",
    count: 198,
  },
  {
    id: 6,
    title: "Literasi dalam Bahasa Inggris",
    icon: Languages,
    gradient: "from-indigo-400 to-indigo-600",
    count: 167,
  },
];

export const stats = [
  {
    label: "Try Out Dikerjakan",
    value: "0",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Rata-rata Skor",
    value: "-",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "Peringkat",
    value: "-",
    icon: Award,
    color: "from-orange-500 to-orange-600",
  },
];
