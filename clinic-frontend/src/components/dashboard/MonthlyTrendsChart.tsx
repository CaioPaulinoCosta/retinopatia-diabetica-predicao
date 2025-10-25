import { useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import type { MonthlyStats } from "../../types/dashboard";

// Registrar todos os componentes necessários
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

interface MonthlyTrendsChartProps {
  trends: MonthlyStats[];
}

export function MonthlyTrendsChart({ trends }: MonthlyTrendsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"line"> | null>(null);

  useEffect(() => {
    if (!chartRef.current || trends.length === 0) return;

    // Destruir chart anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const data = {
      labels: trends.map((trend) => {
        const [year, month] = trend.month.split("-");
        const monthNames = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];
        return `${monthNames[parseInt(month) - 1]}/${year.slice(-2)}`;
      }),
      datasets: [
        {
          label: "Total de Exames",
          data: trends.map((trend) => trend.exams),
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Com Retinopatia",
          data: trends.map((trend) => trend.positive),
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Sem Retinopatia",
          data: trends.map((trend) => trend.negative),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: data,
      options: options,
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [trends]);

  if (trends.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <p className="text-gray-500">Não há dados disponíveis para o gráfico</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <canvas ref={chartRef} />
    </div>
  );
}
