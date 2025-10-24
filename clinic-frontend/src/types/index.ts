// Interfaces principais
export interface Patient {
  id?: number;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: "male" | "female" | "other";
  address: string;
  emergency_contact?: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
  insurance_provider?: string;
  insurance_number?: string;
  has_diabetes: boolean;
  additional_notes?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Exam {
  id?: number;
  patient_id: number;
  exam_type: string; // Nome correto para a API
  exam_date: string; // Nome correto para a API
  description?: string;
  notes?: string;
  status: "pending" | "completed" | "cancelled";
  image_url?: string;
  image_file?: File; // Para upload
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  patient?: Patient; // Relacionamento
}

export interface ExamResult {
  id?: number;
  exam_id: number;
  diagnosis: "No_DR" | "Mild" | "Moderate" | "Severe" | "Proliferative";
  probability_dr?: number;
  probability_no_dr?: number;
  class_predicted?: number;
  recommendation?: string;
  ml_api_response?: string;
  is_auto_diagnosis?: boolean;
  analyzed_at?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  exam?: Exam;
}

export interface LegacyExamResult {
  id?: number;
  exam_id: number;
  diagnosis_type: "automatic" | "manual";
  diagnosis: "No_DR" | "Mild" | "Moderate" | "Severe" | "Proliferative";
  confidence?: number;
  probabilities?: {
    No_DR: number;
    Mild: number;
    Moderate: number;
    Severe: number;
    Proliferative: number;
  };
  recommendations?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  exam?: Exam;
}

// Tipo para upload de imagem
export interface ImageUploadResponse {
  url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

// Tipo para análise da ML API
export interface MLAnalysisRequest {
  image_url: string;
}

export interface MLAnalysisResponse {
  diagnosis: "No_DR" | "Mild" | "Moderate" | "Severe" | "Proliferative";
  confidence: number;
  probabilities: {
    No_DR: number;
    Mild: number;
    Moderate: number;
    Severe: number;
    Proliferative: number;
  };
  recommendations: string;
  processing_time: number;
}
