import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Eye,
  Info,
  MessageCircle,
  Settings,
  Sun,
} from "lucide-react";
import { ScoreData, StatCard } from "./interface";

export const stats: StatCard[] = [
  {
    label: "SKOR TERAKHIR",
    value: "0",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    label: "PERSONAL BEST",
    value: "0",
    icon: Award,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    label: "AKTIVITAS MINGGUAN",
    value: "0",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    suffix: "minggu",
  },
  {
    label: "TOTAL TRYOUT",
    value: "0",
    icon: CheckCircle2,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    suffix: "selesai",
  },
];

export const weekDays = ["Kam", "Jum", "Sab", "Min", "Sen", "Sel", "Rab"];

export const scoreHistory: ScoreData[] = [
  {
    to: "TO 1",
    total: 520,
    pu: 85,
    ppu: 90,
    pbm: 88,
    pk: 82,
    literasiIndo: 87,
    literasiEng: 88,
  },
  {
    to: "TO 2",
    total: 545,
    pu: 88,
    ppu: 92,
    pbm: 90,
    pk: 85,
    literasiIndo: 90,
    literasiEng: 90,
  },
  {
    to: "TO 3",
    total: 580,
    pu: 92,
    ppu: 95,
    pbm: 93,
    pk: 90,
    literasiIndo: 93,
    literasiEng: 92,
  },
  {
    to: "TO 4",
    total: 560,
    pu: 90,
    ppu: 93,
    pbm: 91,
    pk: 87,
    literasiIndo: 91,
    literasiEng: 89,
  },
  {
    to: "TO 5",
    total: 610,
    pu: 95,
    ppu: 98,
    pbm: 96,
    pk: 93,
    literasiIndo: 95,
    literasiEng: 94,
  },
];

export const subtests = [
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
    id: "literasiIndo",
    label: "Literasi Indonesia",
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
  },
  {
    id: "literasiEng",
    label: "Literasi Inggris",
    color: "bg-indigo-500",
    hoverColor: "hover:bg-indigo-600",
  },
];

export const menuItems = [
  {
    icon: Settings,
    label: "Pengaturan Cepat",
    description: "Sesuaikan preferensi kamu",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    items: [
      {
        icon: Sun,
        label: "Tema",
        description: "Terang atau gelap",
        toggle: true,
      },
      {
        icon: Eye,
        label: "Privasi Leaderboard",
        description: "Sembunyikan nama",
        toggle: true,
      },
    ],
  },
  {
    icon: MessageCircle,
    label: "Customer Care",
    description: "Butuh bantuan? Hubungi kami",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    action: "Chat di WhatsApp",
  },
  {
    icon: Info,
    label: "Lainnya",
    description: "Eksplor menu lain",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    items: [
      { icon: Info, label: "Tentang JituPTN", link: true },
      { icon: BarChart3, label: "Lihat Insight Lengkap", link: true },
    ],
  },
];
