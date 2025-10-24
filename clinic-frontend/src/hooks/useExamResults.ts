import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resultsService } from "../services/results";
import type { ExamResult } from "../types";

export function useExamResults() {
  const queryClient = useQueryClient();

  const analyzeMutation = useMutation({
    mutationFn: resultsService.analyzeExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
  });

  const manualDiagnosisMutation = useMutation({
    mutationFn: ({
      examId,
      data,
    }: {
      examId: number;
      data: Partial<ExamResult>;
    }) => resultsService.manualDiagnosis(examId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ExamResult> }) =>
      resultsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: resultsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
  });

  return {
    analyzeExam: analyzeMutation.mutateAsync,
    createManualDiagnosis: manualDiagnosisMutation.mutateAsync,
    updateResult: updateMutation.mutateAsync,
    deleteResult: deleteMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    isCreatingManual: manualDiagnosisMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

/**
 * Hook para buscar resultado pelo ID do exame
 */
export function useExamResultByExamId(examId?: number) {
  const query = useQuery({
    queryKey: ["exam-results", "by-exam", examId],
    queryFn: async () => {
      if (!examId) return null;
      try {
        const data = await resultsService.getByExamId(examId);
        console.log(
          `🔄 DEBUG - useExamResultByExamId for exam ${examId}:`,
          data
        );
        return data;
      } catch (error) {
        console.error(
          `❌ DEBUG - Error in useExamResultByExamId for exam ${examId}:`,
          error
        );
        return null;
      }
    },
    enabled: !!examId,
    retry: 1,
  });

  return {
    result: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch, // ← Adicionar refetch
  };
}

/**
 * Hook para buscar resultado por ID do resultado
 */
export function useResultById(resultId?: number) {
  const query = useQuery({
    queryKey: ["exam-results", resultId],
    queryFn: async () => {
      if (!resultId) return null;
      try {
        const data = await resultsService.getById(resultId);
        console.log(`🔄 DEBUG - useResultById for result ${resultId}:`, data);
        return data;
      } catch (error) {
        console.error(
          `❌ DEBUG - Error in useResultById for result ${resultId}:`,
          error
        );
        throw error;
      }
    },
    enabled: !!resultId,
    retry: 1,
  });

  return {
    result: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
