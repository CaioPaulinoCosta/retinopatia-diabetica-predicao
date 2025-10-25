export interface DashboardStats {
  totalPatients: number;
  totalExams: number;
  examsThisMonth: number;
  pendingExams: number;
  completedExams: number;
  positiveDiagnosis: number;
  negativeDiagnosis: number;
  diabetesPatients?: number;
}

// REMOVER MonthlyTrend e usar apenas MonthlyStats
export interface MonthlyStats {
  month: string;
  exams: number;
  positive: number; // Mudar de positiveCases para positive
  negative: number; // Adicionar campo negative
}

export interface RiskPatient {
  id: number;
  name: string;
  email: string;
  lastExamDate: string;
  diagnosis: string;
  riskLevel: "high" | "medium" | "low";
  examCount?: number;
  latestDiagnosis?: string;
}

export interface DiagnosisDistribution {
  No_DR: number;
  Mild: number;
  Moderate: number;
  Severe: number;
  Proliferative: number;
}

export interface DashboardData {
  stats: DashboardStats;
  diagnosisDistribution: DiagnosisDistribution;
  monthlyTrends: MonthlyStats[]; // Usar MonthlyStats aqui também
  riskPatients: RiskPatient[];
  mlApiUsage: {
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
  };
}
