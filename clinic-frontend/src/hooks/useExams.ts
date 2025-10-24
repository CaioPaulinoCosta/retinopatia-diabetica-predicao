import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examsService } from "../services/exams";
import type { Exam } from "../types";

export function useExams() {
  const queryClient = useQueryClient();

  const {
    data: exams = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      try {
        const data = await examsService.getAll();
        console.log("🔄 DEBUG - useExams received:", {
          data,
          type: typeof data,
          isArray: Array.isArray(data),
          length: data?.length,
        });

        const result = Array.isArray(data) ? data : [];
        console.log("🔄 DEBUG - useExams returning:", result);
        return result;
      } catch (error) {
        console.error("❌ DEBUG - Error in useExams:", error);
        return [];
      }
    },
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: examsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Exam> }) =>
      examsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: examsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });

  return {
    exams,
    isLoading,
    error,
    createExam: createMutation.mutateAsync,
    updateExam: updateMutation.mutateAsync,
    deleteExam: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

/**
 * Hook específico para exames de um paciente
 */
export function usePatientExams(patientId: number) {
  const queryClient = useQueryClient();

  const {
    data: exams = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exams", "patient", patientId],
    queryFn: async () => {
      try {
        const data = await examsService.getByPatient(patientId);
        console.log(`🔄 DEBUG - usePatientExams for patient ${patientId}:`, {
          data,
          length: data?.length,
        });

        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error(
          `❌ DEBUG - Error in usePatientExams for patient ${patientId}:`,
          error
        );
        return [];
      }
    },
    enabled: !!patientId, // Só executa se patientId for válido
    retry: 1,
  });

  return {
    exams,
    isLoading,
    error,
  };
}
