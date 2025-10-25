import { useEffect, useRef } from "react";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";
import type { DiagnosisDistribution } from "../../types/dashboard";

// Registrar todos os elementos necessários
Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

interface DiagnosisChartProps {
  distribution: DiagnosisDistribution;
}

export function DiagnosisChart({ distribution }: DiagnosisChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"doughnut"> | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destruir chart anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const total = Object.values(distribution).reduce(
      (sum, value) => sum + value,
      0
    );

    if (total === 0) return;

    const data = {
      labels: [
        "Sem Retinopatia",
        "Leve",
        "Moderada",
        "Severa",
        "Proliferativa",
      ],
      datasets: [
        {
          data: [
            distribution.No_DR,
            distribution.Mild,
            distribution.Moderate,
            distribution.Severe,
            distribution.Proliferative,
          ],
          backgroundColor: [
            "#10B981",
            "#FBBF24",
            "#F59E0B",
            "#EF4444",
            "#DC2626",
          ],
          borderColor: "#FFFFFF",
          borderWidth: 2,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.label || "";
              const value = context.raw || 0;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    };

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: options,
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [distribution]);

  const total = Object.values(distribution).reduce(
    (sum, value) => sum + value,
    0
  );

  if (total === 0) {
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
