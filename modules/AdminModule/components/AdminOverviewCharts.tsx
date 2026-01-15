import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartItem {
  label: string;
  value: number;
}

interface AdminOverviewChartsProps {
  revenue: ChartItem[];
  userGrowth: ChartItem[];
  weeklyActivity: ChartItem[];
}

export const AdminOverviewCharts: React.FC<AdminOverviewChartsProps> = ({
  revenue,
  userGrowth,
  weeklyActivity,
}) => {
  const revenueData = {
    labels: revenue.map((i) => i.label),
    datasets: [
      {
        fill: true,
        label: "Pendapatan (Rp)",
        data: revenue.map((i) => i.value),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const userGrowthData = {
    labels: userGrowth.map((i) => i.label),
    datasets: [
      {
        fill: true,
        label: "User Baru",
        data: userGrowth.map((i) => i.value),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const activityData = {
    labels: weeklyActivity.map((i) => i.label),
    datasets: [
      {
        label: "Aktivitas Harian",
        data: weeklyActivity.map((i) => i.value),
        backgroundColor: "rgba(139, 92, 246, 0.6)",
        borderRadius: 4,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
            Tren Pendapatan (6 Bulan)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <Line data={revenueData} options={commonOptions} />
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
            Pertumbuhan User (6 Bulan)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <Line data={userGrowthData} options={commonOptions} />
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
            Aktivitas User (7 Hari Terakhir)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <Bar data={activityData} options={commonOptions} />
        </CardContent>
      </Card>
    </div>
  );
};
