import { api } from "@/lib/api";

export interface Exam {
  id: number;
  patient_id: number;
  exam_type: string;
  description: string;
  exam_date: string;
  notes: string;
  user_id: number;
  image_path: string;
  image: File;
  status: string;
  created_at: string;
  updated_at: string;
  patient?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    birth_date: string;
    gender: string;
  };
  result?: {
    id: number;
    exam_id: number;
    diagnosis: string;
    probability_dr: number;
    probability_no_dr: number;
    class_predicted: number;
    recommendation: string;
    analyzed_at: string;
    created_at: string;
    updated_at: string;
    is_auto_diagnosis: boolean;
  } | null;
}

// Obter todos os exames
export async function getExams(): Promise<Exam[]> {
  const response = await api.get("/exams");
  return response.data.data;
}

// Obter um exame pelo ID
export async function getExam(id: number): Promise<Exam> {
  const response = await api.get(`/exams/${id}`);
  return response.data.data;
}

// Criar um novo exame
export async function createExam(data: FormData): Promise<Exam> {
  const response = await api.post("/exams", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

// Atualizar exame
export async function updateExam(id: number, data: FormData): Promise<Exam> {
  const response = await api.post(`/exams/${id}?_method=PUT`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

// Excluir exame
export async function deleteExam(id: number): Promise<void> {
  await api.delete(`/exams/${id}`);
}

// ✅ Analisar exame
export async function analyzeExam(examId: number) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/exam-results/${examId}/analyze`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (!result.success) throw new Error(result.message);

    return result;
  } catch (err: any) {
    console.error("Erro ao analisar exame:", err);
    throw new Error("Erro ao analisar exame.");
  }
}

export interface DashboardStats {
  totalPatients: number;
  totalExams: number;
  positiveCases: number;
  negativeCases: number;
  pendingAnalysis: number;
}

export interface RecentExam {
  id: string;
  patientName: string;
  date: string;
  result: "positive" | "negative" | "pending";
  confidence?: number;
}

export interface MonthlyData {
  month: string;
  exams: number;
  positive: number;
}

// Funções para o dashboard
export const getDashboardStats = async (): Promise<any> => {
  // Se você tiver um endpoint específico para estatísticas no Laravel
  const response = await fetch("/api/dashboard/stats");
  if (!response.ok) throw new Error("Erro ao buscar estatísticas do dashboard");
  return response.json();
};

export const getRecentExams = async (limit: number = 5): Promise<Exam[]> => {
  const response = await fetch(`/api/exams/recent?limit=${limit}`);
  if (!response.ok) throw new Error("Erro ao buscar exames recentes");
  return response.json();
};

export const getMonthlyData = async (): Promise<any[]> => {
  const response = await fetch("/api/dashboard/monthly-data");
  if (!response.ok) throw new Error("Erro ao buscar dados mensais");
  return response.json();
};
