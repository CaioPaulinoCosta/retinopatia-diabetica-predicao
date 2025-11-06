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
}

// Obter todos os exames
export async function getExams(): Promise<Exam[]> {
  const response = await api.get("/exams");
  return response.data.data;
}
