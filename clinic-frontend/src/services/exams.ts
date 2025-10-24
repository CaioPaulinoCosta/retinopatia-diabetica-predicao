import { api } from "./api";
import type { Exam, ImageUploadResponse } from "../types";

export const examsService = {
  /**
   * Buscar todos os exames
   */
  async getAll() {
    console.log("🔌 DEBUG - Fetching exams from API...");
    try {
      const response = await api.get("/exams");
      console.log("🔌 DEBUG - Exams API Response:", response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        console.log("✅ DEBUG - Found exams in response.data.data");
        return response.data.data;
      } else {
        console.warn(
          "⚠️ DEBUG - Unexpected exams response format, returning empty array"
        );
        return [];
      }
    } catch (error) {
      console.error("❌ DEBUG - Exams API Error:", error);
      throw error;
    }
  },

  /**
   * Buscar exame por ID
   */
  async getById(id: number): Promise<Exam> {
    console.log(`🔌 DEBUG - Fetching exam ${id} from API...`);
    try {
      const response = await api.get(`/exams/${id}`);
      console.log("🔌 DEBUG - Exam by ID Response:", response.data);

      return response.data.data || response.data;
    } catch (error) {
      console.error(`❌ DEBUG - Error fetching exam ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar exames por paciente
   */
  async getByPatient(patientId: number): Promise<Exam[]> {
    console.log(`🔌 DEBUG - Fetching exams for patient ${patientId}...`);
    try {
      const response = await api.get(`/exams/patient/${patientId}`);
      console.log("🔌 DEBUG - Exams by patient Response:", response.data);

      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.error(
        `❌ DEBUG - Error fetching exams for patient ${patientId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Criar novo exame (com upload de imagem)
   */
  async create(examData: FormData): Promise<Exam> {
    console.log("🔌 DEBUG - Creating new exam...");

    // DEBUG: Mostrar o que está no FormData
    console.log("🔌 DEBUG - FormData contents:");
    for (let [key, value] of (examData as any).entries()) {
      console.log(`  ${key}:`, value, typeof value);
    }

    try {
      const response = await api.post("/exams", examData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ DEBUG - Exam created successfully:", response.data);

      return response.data.data || response.data;
    } catch (error: any) {
      console.error("❌ DEBUG - Error creating exam:", error);

      // Mostrar detalhes do erro 422
      if (error.response?.status === 422) {
        console.error("🔍 DEBUG - Full error response:", error.response.data);
        console.error(
          "🔍 DEBUG - Validation errors:",
          JSON.stringify(error.response.data.errors, null, 2)
        );

        // Mostrar cada erro individualmente
        if (error.response.data.errors) {
          Object.entries(error.response.data.errors).forEach(
            ([field, errors]) => {
              console.error(`🔍 DEBUG - Field "${field}":`, errors);
            }
          );
        }
      }

      throw error;
    }
  },

  /**
   * Atualizar exame
   */
  async update(id: number, exam: Partial<Exam>): Promise<Exam> {
    console.log(`🔌 DEBUG - Updating exam ${id}...`);
    try {
      const response = await api.put(`/exams/${id}`, exam);
      console.log("✅ DEBUG - Exam updated successfully:", response.data);

      return response.data.data || response.data;
    } catch (error) {
      console.error(`❌ DEBUG - Error updating exam ${id}:`, error);
      throw error;
    }
  },

  /**
   * Excluir exame
   */
  async delete(id: number): Promise<void> {
    console.log(`🔌 DEBUG - Deleting exam ${id}...`);
    try {
      const response = await api.delete(`/exams/${id}`);
      console.log("✅ DEBUG - Exam deleted successfully:", response.data);

      return response.data.data || response.data;
    } catch (error) {
      console.error(`❌ DEBUG - Error deleting exam ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload de imagem separado (se necessário)
   */
  async uploadImage(imageFile: File): Promise<ImageUploadResponse> {
    console.log("🔌 DEBUG - Uploading image...");
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await api.post("/exams/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("✅ DEBUG - Image uploaded successfully:", response.data);

      return response.data.data || response.data;
    } catch (error) {
      console.error("❌ DEBUG - Error uploading image:", error);
      throw error;
    }
  },
};
