import { Subtest } from "./interface";

// Subtest configuration for chart display
export const subtests: Subtest[] = [
  {
    id: "total",
    label: "Total Skor",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    id: "pu",
    label: "Penalaran Umum",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
  },
  {
    id: "ppu",
    label: "PPU",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
  },
  {
    id: "pbm",
    label: "PBM",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
  },
  {
    id: "pk",
    label: "Pengetahuan Kuantitatif",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
  },
  {
    id: "lbi",
    label: "Literasi Indonesia",
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
  },
  {
    id: "lbe",
    label: "Literasi Inggris",
    color: "bg-indigo-500",
    hoverColor: "hover:bg-indigo-600",
  },
  {
    id: "pm",
    label: "Penalaran Matematika",
    color: "bg-teal-500",
    hoverColor: "hover:bg-teal-600",
  },
];
