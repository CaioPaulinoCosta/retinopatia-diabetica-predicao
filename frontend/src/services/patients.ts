import { api } from "@/lib/api";

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  address: string;
  emergency_contact: string;
  medical_history: string;
  allergies: string;
  current_medications: string;
  insurance_provider: string;
  insurance_number: string;
  has_diabetes: boolean;
  additional_notes: string;
  user_id: string;
}

// Obter todos os pacientes
export async function getPatients(): Promise<Patient[]> {
  const response = await api.get("/patients");
  return response.data.data;
}

// Obter um paciente pelo ID
export async function getPatient(id: number): Promise<Patient> {
  const response = await api.get(`/patients/${id}`);
  return response.data.data;
}

// Criar um novo paciente
export async function createPatient(data: Partial<Patient>): Promise<Patient> {
  const response = await api.post("/patients", data);
  return response.data;
}

// Atualizar um paciente pelo ID
export async function updatePatient(
  id: number,
  data: Partial<Patient>
): Promise<Patient> {
  const response = await api.put(`/patients/${id}`, data);
  return response.data;
}

// Deletar um paciente pelo ID
export async function deletePatient(id: number): Promise<void> {
  await api.delete(`/patients/${id}`);
}
