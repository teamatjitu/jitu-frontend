import { AdminTryoutStatsResponse, StatCard } from "./interface";
import { Award, BarChart3, Calendar, CheckCircle2 } from "lucide-react";

export const stats: StatCard[] = [
  {
    label: "TOTAL TRYOUT",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    label: "TRYOUT AKTIF",
    icon: Award,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    label: "BELUM RILIS",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    label: "SELESAI",
    icon: Calendar,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
];
