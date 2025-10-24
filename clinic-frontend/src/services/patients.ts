import { api } from "./api";
import type { Patient } from "../types";

export const patientsService = {
  async getAll() {
    console.log("🔌 DEBUG - Fetching patients from API...");
    try {
      const response = await api.get("/patients");
      console.log("🔌 DEBUG - API Response:", response.data);

      // A API retorna { success: true, data: [...], count: X }
      if (response.data.success && Array.isArray(response.data.data)) {
        console.log("✅ DEBUG - Found patients in response.data.data");
        return response.data.data;
      } else {
        console.warn(
          "⚠️ DEBUG - Unexpected response format, returning empty array"
        );
        return [];
      }
    } catch (error) {
      console.error("❌ DEBUG - API Error:", error);
      throw error;
    }
  },

  async getById(id: number) {
    const response = await api.get(`/patients/${id}`);
    // Provavelmente retorna { success: true, data: {...} }
    return response.data.data || response.data;
  },

  async create(patient: Omit<Patient, "id">) {
    const response = await api.post("/patients", patient);
    // Provavelmente retorna { success: true, data: {...} }
    return response.data.data || response.data;
  },

  async update(id: number, patient: Partial<Patient>) {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data.data || response.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/patients/${id}`);
    return response.data.data || response.data;
  },

  async getWithDiabetes() {
    const response = await api.get("/patients?has_diabetes=true");
    return response.data.data || response.data;
  },
};
