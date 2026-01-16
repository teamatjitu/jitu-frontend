import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ScoreDistributionChartProps {
  distribution: {
    under400: number;
    range400to600: number;
    range600to800: number;
    above800: number;
  };
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({
  distribution,
}) => {
  const data = {
    labels: ["< 400", "400 - 600", "600 - 800", "> 800"],
    datasets: [
      {
        label: "Jumlah Peserta",
        data: [
          distribution.under400,
          distribution.range400to600,
          distribution.range600to800,
          distribution.above800,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.6)", // Red
          "rgba(245, 158, 11, 0.6)", // Orange
          "rgba(59, 130, 246, 0.6)", // Blue
          "rgba(16, 185, 129, 0.6)", // Green
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(245, 158, 11)",
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
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
    <Card className="border-border/50 shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Distribusi Nilai</CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <Bar data={data} options={options} />
      </CardContent>
    </Card>
  );
};
