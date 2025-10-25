import { api } from "./api";
import type {
  DashboardData,
  DashboardStats,
  DiagnosisDistribution,
  MonthlyStats,
  RiskPatient,
} from "../types/dashboard";

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    console.log("📊 DEBUG - Fetching dashboard data...");

    try {
      const [patientsResponse, examsResponse, resultsResponse] =
        await Promise.all([
          api.get("/patients"),
          api.get("/exams"),
          api.get("/exam-results"),
        ]);

      const patients = patientsResponse.data.success
        ? patientsResponse.data.data
        : [];
      const exams = examsResponse.data.success ? examsResponse.data.data : [];
      const results = resultsResponse.data.success
        ? resultsResponse.data.data
        : [];

      console.log("📊 DEBUG - Raw data counts:", {
        patients: patients.length,
        exams: exams.length,
        results: results.length,
      });

      const stats = this.calculateStats(patients, exams, results);
      const diagnosisDistribution =
        this.calculateDiagnosisDistribution(results);
      const monthlyTrends = this.calculateMonthlyTrends(exams, results);
      const riskPatients = this.identifyRiskPatients(patients, exams, results);
      const mlApiUsage = this.calculateMLApiUsage(results);

      return {
        stats,
        diagnosisDistribution,
        monthlyTrends,
        riskPatients,
        mlApiUsage,
      };
    } catch (error) {
      console.error("❌ DEBUG - Error fetching dashboard data:", error);
      throw error;
    }
  },

  calculateStats(
    patients: any[],
    exams: any[],
    results: any[]
  ): DashboardStats {
    const diabetesPatients = patients.filter((p) => p.has_diabetes).length;
    const pendingExams = exams.filter((e) => e.status === "pending").length;
    const completedExams = exams.filter((e) => e.status === "completed").length;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const examsThisMonth = exams.filter((e) => {
      const examDate = new Date(e.exam_date);
      return (
        examDate.getMonth() === currentMonth &&
        examDate.getFullYear() === currentYear
      );
    }).length;

    const positiveDiagnosis = results.filter(
      (r) => r.diagnosis && r.diagnosis !== "No_DR"
    ).length;

    const negativeDiagnosis = results.filter(
      (r) => r.diagnosis && r.diagnosis === "No_DR"
    ).length;

    return {
      totalPatients: patients.length,
      totalExams: exams.length,
      examsThisMonth,
      pendingExams,
      completedExams,
      positiveDiagnosis,
      negativeDiagnosis,
      diabetesPatients,
    };
  },

  calculateDiagnosisDistribution(results: any[]): DiagnosisDistribution {
    const distribution: DiagnosisDistribution = {
      No_DR: 0,
      Mild: 0,
      Moderate: 0,
      Severe: 0,
      Proliferative: 0,
    };

    results.forEach((result) => {
      if (result.diagnosis && distribution.hasOwnProperty(result.diagnosis)) {
        distribution[result.diagnosis as keyof DiagnosisDistribution]++;
      }
    });

    return distribution;
  },

  calculateMonthlyTrends(exams: any[], results: any[]): MonthlyStats[] {
    const monthlyData: {
      [key: string]: { exams: number; positive: number; negative: number };
    } = {};

    // Agrupar por mês
    exams.forEach((exam) => {
      const date = new Date(exam.exam_date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { exams: 0, positive: 0, negative: 0 };
      }

      monthlyData[monthKey].exams++;
    });

    // Contar casos positivos e negativos
    results.forEach((result) => {
      if (result.exam_id) {
        const exam = exams.find((e) => e.id === result.exam_id);
        if (exam && exam.exam_date) {
          const date = new Date(exam.exam_date);
          const monthKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

          if (monthlyData[monthKey]) {
            if (result.diagnosis && result.diagnosis !== "No_DR") {
              monthlyData[monthKey].positive++;
            } else {
              monthlyData[monthKey].negative++;
            }
          }
        }
      }
    });

    // Converter para array e ordenar
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        exams: data.exams,
        positive: data.positive,
        negative: data.negative,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  },

  identifyRiskPatients(
    patients: any[],
    exams: any[],
    results: any[]
  ): RiskPatient[] {
    const riskPatients: RiskPatient[] = [];

    patients.forEach((patient) => {
      if (!patient.has_diabetes) return;

      const patientExams = exams.filter((e) => e.patient_id === patient.id);
      const examCount = patientExams.length;

      if (examCount === 0) return;

      let latestDiagnosis = "No_DR";
      let lastExamDate = "";

      patientExams.forEach((exam) => {
        const examResults = results.filter((r) => r.exam_id === exam.id);
        examResults.forEach((result) => {
          if (result.diagnosis && result.diagnosis !== "No_DR") {
            latestDiagnosis = result.diagnosis;
          }
          if (!lastExamDate || exam.exam_date > lastExamDate) {
            lastExamDate = exam.exam_date;
          }
        });
      });

      let riskLevel: "low" | "medium" | "high" = "low";
      if (latestDiagnosis === "Moderate") riskLevel = "medium";
      if (latestDiagnosis === "Severe" || latestDiagnosis === "Proliferative")
        riskLevel = "high";
      if (examCount >= 3 && latestDiagnosis !== "No_DR") riskLevel = "high";

      riskPatients.push({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        lastExamDate,
        diagnosis: latestDiagnosis,
        riskLevel,
        examCount,
        latestDiagnosis,
      });
    });

    return riskPatients
      .sort((a, b) => {
        const riskOrder = { high: 3, medium: 2, low: 1 };
        return (
          riskOrder[b.riskLevel] - riskOrder[a.riskLevel] ||
          (b.examCount || 0) - (a.examCount || 0)
        );
      })
      .slice(0, 5);
  },

  calculateMLApiUsage(results: any[]): {
    totalRequests: number;
    successRate: number;
    averageResponseTime: number;
  } {
    const autoResults = results.filter((r) => r.is_auto_diagnosis);
    const totalRequests = autoResults.length;
    const successRate = totalRequests > 0 ? 0.95 : 0;
    const averageResponseTime = 2.5;

    return {
      totalRequests,
      successRate,
      averageResponseTime,
    };
  },
};
