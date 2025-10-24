import { api } from "./api";
import type { ExamResult, LegacyExamResult } from "../types";

export const resultsService = {
  /**
   * Buscar resultado por ID do exame
   */
  async getByExamId(examId: number): Promise<ExamResult | null> {
    console.log(`🔬 DEBUG - Fetching result for exam ${examId}...`);

    try {
      // Tenta buscar através do endpoint de exames
      const response = await api.get(`/exams/${examId}`);
      console.log("🔬 DEBUG - Exam data with result:", response.data);

      if (response.data.success && response.data.data) {
        const examData = response.data.data;

        // Verifica se o exame tem resultado incluído
        if (examData.result) {
          console.log("✅ DEBUG - Found result in exam data");
          return this.normalizeResult(examData.result);
        }
      }

      console.log("🔍 DEBUG - No result found in exam data");
      return null;
    } catch (error: any) {
      console.error(`❌ DEBUG - Error fetching exam ${examId}:`, error);
      return null;
    }
  },

  /**
   * Analisar exame com ML API
   */
  async analyzeExam(examId: number): Promise<ExamResult> {
    console.log(`🔬 DEBUG - Analyzing exam ${examId} with ML API...`);
    try {
      const response = await api.post(`/exam-results/${examId}/analyze`);
      console.log("✅ DEBUG - Exam analysis completed:", response.data);

      // A API retorna o resultado dentro de data.result
      if (
        response.data.success &&
        response.data.data &&
        response.data.data.result
      ) {
        return this.normalizeResult(response.data.data.result);
      }

      throw new Error("Formato de resposta inválido da API");
    } catch (error: any) {
      console.error(`❌ DEBUG - Error analyzing exam ${examId}:`, error);
      throw error;
    }
  },

  /**
   * Diagnóstico manual
   */
  async manualDiagnosis(
    examId: number,
    data: Partial<ExamResult>
  ): Promise<ExamResult> {
    console.log(`🔬 DEBUG - Creating manual diagnosis for exam ${examId}...`);
    try {
      const response = await api.post(`/exam-results/${examId}/manual`, data);
      console.log("✅ DEBUG - Manual diagnosis created:", response.data);

      if (response.data.success && response.data.data) {
        return this.normalizeResult(response.data.data);
      }

      throw new Error("Formato de resposta inválido da API");
    } catch (error: any) {
      console.error(
        `❌ DEBUG - Error creating manual diagnosis for exam ${examId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Buscar resultado por ID do resultado
   */
  async getById(id: number): Promise<ExamResult> {
    console.log(`🔬 DEBUG - Fetching result ${id}...`);
    try {
      const response = await api.get(`/exam-results/${id}`);
      console.log("🔬 DEBUG - Result by ID Response:", response.data);

      if (response.data.success && response.data.data) {
        return this.normalizeResult(response.data.data);
      }

      throw new Error("Formato de resposta inválido da API");
    } catch (error) {
      console.error(`❌ DEBUG - Error fetching result ${id}:`, error);
      throw error;
    }
  },

  /**
   * Atualizar resultado
   */
  async update(id: number, data: Partial<ExamResult>): Promise<ExamResult> {
    console.log(`🔬 DEBUG - Updating result ${id}...`);
    try {
      const response = await api.put(`/exam-results/${id}`, data);
      console.log("✅ DEBUG - Result updated successfully:", response.data);

      if (response.data.success && response.data.data) {
        return this.normalizeResult(response.data.data);
      }

      throw new Error("Formato de resposta inválido da API");
    } catch (error) {
      console.error(`❌ DEBUG - Error updating result ${id}:`, error);
      throw error;
    }
  },

  /**
   * Excluir resultado
   */
  async delete(id: number): Promise<void> {
    console.log(`🔬 DEBUG - Deleting result ${id}...`);
    try {
      const response = await api.delete(`/exam-results/${id}`);
      console.log("✅ DEBUG - Result deleted successfully:", response.data);

      return response.data.data || response.data;
    } catch (error) {
      console.error(`❌ DEBUG - Error deleting result ${id}:`, error);
      throw error;
    }
  },

  /**
   * Normalizar resultado da API para formato padrão
   */
  normalizeResult(apiResult: any): ExamResult {
    console.log("🔄 DEBUG - Normalizing API result:", apiResult);

    // Se já estiver no formato correto, retorna como está
    if (apiResult.diagnosis && apiResult.exam_id) {
      return {
        id: apiResult.id,
        exam_id: apiResult.exam_id,
        diagnosis: apiResult.diagnosis,
        probability_dr: apiResult.probability_dr
          ? parseFloat(apiResult.probability_dr)
          : undefined,
        probability_no_dr: apiResult.probability_no_dr
          ? parseFloat(apiResult.probability_no_dr)
          : undefined,
        class_predicted: apiResult.class_predicted,
        recommendation: apiResult.recommendation,
        ml_api_response: apiResult.ml_api_response,
        is_auto_diagnosis: apiResult.is_auto_diagnosis,
        analyzed_at: apiResult.analyzed_at,
        notes: apiResult.notes,
        created_at: apiResult.created_at,
        updated_at: apiResult.updated_at,
      };
    }

    // Se for formato legado, converte
    return {
      id: apiResult.id,
      exam_id: apiResult.exam_id,
      diagnosis: apiResult.diagnosis || "No_DR",
      probability_dr: apiResult.probability_dr,
      probability_no_dr: apiResult.probability_no_dr,
      class_predicted: apiResult.class_predicted,
      recommendation: apiResult.recommendation || apiResult.recommendations,
      ml_api_response: apiResult.ml_api_response,
      is_auto_diagnosis:
        apiResult.is_auto_diagnosis !== undefined
          ? apiResult.is_auto_diagnosis
          : true,
      analyzed_at: apiResult.analyzed_at,
      notes: apiResult.notes,
      created_at: apiResult.created_at,
      updated_at: apiResult.updated_at,
    };
  },
};
