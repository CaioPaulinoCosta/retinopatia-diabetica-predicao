import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard";
import type { DashboardData } from "../types/dashboard"; // Corrigido o tipo

export function useDashboard() {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardData>({
    // Corrigido o tipo genérico
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getDashboardData(),
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    retry: 2,
  });

  return {
    dashboardData,
    isLoading,
    error,
    refetch,
  };
}
