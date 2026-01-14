import { Banknote, CheckCircle2, Clock } from "lucide-react";
import { StatCardData } from "@/components/elements/Admin/StatCard";

export const getPaymentStatsConfig = (
  totalRevenue: number,
  totalSuccess: number,
  totalPending: number
): Omit<StatCardData, "isLoading">[] => [
  {
    label: "TOTAL PENDAPATAN",
    icon: Banknote,
    color: "text-green-600",
    bgColor: "bg-green-100",
    value: totalRevenue,
    suffix: "Rupiah",
  },
  {
    label: "TRANSAKSI SUKSES",
    icon: CheckCircle2,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    value: totalSuccess,
  },
  {
    label: "MENUNGGU KONFIRMASI",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    value: totalPending,
  },
];
