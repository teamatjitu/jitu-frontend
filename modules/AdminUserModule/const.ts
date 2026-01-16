import { Users, UserCheck, Shield } from "lucide-react";
import { StatCardData } from "@/components/elements/Admin/StatCard";

// Helper to create stat config
export const getStatsConfig = (
  totalUser: number,
  activeUser: number,
  totalAdmin: number
): Omit<StatCardData, "isLoading">[] => [
  {
    label: "TOTAL USER",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    value: totalUser,
  },
  {
    label: "USER AKTIF",
    icon: UserCheck,
    color: "text-green-600",
    bgColor: "bg-green-100",
    value: activeUser,
  },
  {
    label: "TOTAL ADMIN",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    value: totalAdmin,
  },
];
