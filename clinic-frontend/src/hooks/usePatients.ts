import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsService } from "../services/patients";
import type { Patient } from "../types";

export function usePatients() {
  const queryClient = useQueryClient();

  const {
    data: patients,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      try {
        const data = await patientsService.getAll();
        // Garante que sempre retorne um array
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("❌ DEBUG - Error in usePatients:", error);
        return []; // Retorna array vazio em caso de erro
      }
    },
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: patientsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Patient> }) =>
      patientsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: patientsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  return {
    patients: patients || [], // Garante que nunca seja undefined
    isLoading,
    error,
    createPatient: createMutation.mutateAsync,
    updatePatient: updateMutation.mutateAsync,
    deletePatient: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
