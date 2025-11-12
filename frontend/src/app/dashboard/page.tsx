"use client";

import PrivateRoute from "@/components/Auth/PrivateRoutes";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/config/routes";
import { logoutUser } from "@/services/authService";
import {
  getExams,
  deleteExam,
  Exam,
  getDashboardStats,
  getRecentExams,
  getMonthlyData,
} from "@/services/exams";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Eye,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  User,
  LogOut,
  Settings,
} from "lucide-react";

// Tipos para os dados do dashboard
interface DashboardStats {
  totalPatients: number;
  totalExams: number;
  positiveCases: number;
  negativeCases: number;
  pendingAnalysis: number;
}

interface RecentExam {
  id: string;
  patientName: string;
  date: string;
  result: "positive" | "negative" | "pending";
  confidence?: number;
}

interface MonthlyData {
  month: string;
  exams: number;
  positive: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalExams: 0,
    positiveCases: 0,
    negativeCases: 0,
    pendingAnalysis: 0,
  });
  const [recentExams, setRecentExams] = useState<RecentExam[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para determinar o resultado baseado na análise
  const getExamResult = (exam: Exam): "positive" | "negative" | "pending" => {
    if (!exam.result) return "pending";

    // Baseado no seu código de análise, verifica se há diagnóstico de DR
    if (exam.result.diagnosis === "No_DR") {
      return "negative";
    } else {
      return "positive";
    }
  };

  // Função para obter a confiança do exame
  const getExamConfidence = (exam: Exam): number | undefined => {
    if (!exam.result) return undefined;

    // Usa a probabilidade de DR como confiança
    return exam.result.probability_dr
      ? Math.round(exam.result.probability_dr * 100)
      : undefined;
  };

  // Carrega todos os dados do dashboard
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Carrega exames
        const examsData = await getExams();
        setExams(examsData);

        // Calcula estatísticas baseadas nos exames
        const totalExams = examsData.length;
        const positiveCases = examsData.filter(
          (exam) => exam.result && exam.result.diagnosis !== "No_DR"
        ).length;
        const negativeCases = examsData.filter(
          (exam) => exam.result && exam.result.diagnosis === "No_DR"
        ).length;
        const pendingAnalysis = examsData.filter((exam) => !exam.result).length;

        // Estima total de pacientes únicos (você pode querer uma API específica para isso)
        const uniquePatients = new Set(examsData.map((exam) => exam.patient_id))
          .size;

        setStats({
          totalPatients: uniquePatients,
          totalExams: totalExams,
          positiveCases: positiveCases,
          negativeCases: negativeCases,
          pendingAnalysis: pendingAnalysis,
        });

        // Prepara exames recentes (últimos 5)
        const recentExamsData = examsData.slice(0, 5).map((exam) => ({
          id: exam.id.toString(),
          patientName: exam.patient?.name || "Paciente não identificado",
          date: exam.exam_date,
          result: getExamResult(exam),
          confidence: getExamConfidence(exam),
        }));

        setRecentExams(recentExamsData);

        // Prepara dados mensais (agrupa por mês)
        const monthlyStats: {
          [key: string]: { exams: number; positive: number };
        } = {};

        examsData.forEach((exam) => {
          const date = new Date(exam.exam_date);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const monthName = date.toLocaleDateString("pt-BR", {
            month: "short",
          });

          if (!monthlyStats[monthKey]) {
            monthlyStats[monthKey] = {
              exams: 0,
              positive: 0,
              month: monthName,
            };
          }

          monthlyStats[monthKey].exams += 1;
          if (exam.result && exam.result.diagnosis !== "No_DR") {
            monthlyStats[monthKey].positive += 1;
          }
        });

        const monthlyDataArray = Object.entries(monthlyStats)
          .slice(-6) // Últimos 6 meses
          .map(([key, data]) => ({
            month: data.month,
            exams: data.exams,
            positive: data.positive,
          }));

        setMonthlyData(monthlyDataArray);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);

        // Fallback para dados mockados em caso de erro
        setStats({
          totalPatients:
            exams.length > 0
              ? new Set(exams.map((exam) => exam.patient_id)).size
              : 0,
          totalExams: exams.length,
          positiveCases: exams.filter(
            (exam) => exam.result && exam.result.diagnosis !== "No_DR"
          ).length,
          negativeCases: exams.filter(
            (exam) => exam.result && exam.result.diagnosis === "No_DR"
          ).length,
          pendingAnalysis: exams.filter((exam) => !exam.result).length,
        });
      } finally {
        setLoading(false);
      }
    }

    if (!isLoading) {
      fetchDashboardData();
    }
  }, [isLoading]);

  async function handleLogout() {
    try {
      await logoutUser();
      router.push(routes.home);
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  // Função para navegar para detalhes do exame
  const handleViewExamDetails = (examId: number) => {
    router.push(`${routes.exams}/${examId}`);
  };

  // Cores para os gráficos
  const COLORS = ["#10B981", "#EF4444", "#F59E0B"];
  const PIE_COLORS = ["#EF4444", "#10B981", "#F59E0B"];

  const resultData = [
    { name: "Positivo", value: stats.positiveCases },
    { name: "Negativo", value: stats.negativeCases },
    { name: "Pendente", value: stats.pendingAnalysis },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color }}>
            {value}
          </p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div
          className={`p-3 rounded-full`}
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );

  const ExamStatusBadge = ({ result }: { result: string }) => {
    const config = {
      positive: {
        color: "bg-red-100 text-red-800",
        icon: AlertTriangle,
        label: "Positivo",
      },
      negative: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Negativo",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pendente",
      },
    };

    const { color, icon: Icon, label } = config[result as keyof typeof config];

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}
      >
        <Icon size={14} className="mr-1" />
        {label}
      </span>
    );
  };

  if (isLoading || loading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-slate-600 text-lg mt-4">
              Carregando dashboard...
            </p>
          </div>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />

        <main className="flex-1 p-6 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total de Pacientes"
              value={stats.totalPatients.toLocaleString()}
              icon={Users}
              color="#3B82F6"
            />
            <StatCard
              title="Exames Realizados"
              value={stats.totalExams.toLocaleString()}
              icon={FileText}
              color="#8B5CF6"
            />
            <StatCard
              title="Casos Positivos"
              value={stats.positiveCases.toLocaleString()}
              icon={AlertTriangle}
              color="#EF4444"
              subtitle={
                stats.totalExams > 0
                  ? `${((stats.positiveCases / stats.totalExams) * 100).toFixed(
                      1
                    )}% dos exames`
                  : "0% dos exames"
              }
            />
            <StatCard
              title="Análises Pendentes"
              value={stats.pendingAnalysis}
              icon={Clock}
              color="#F59E0B"
              subtitle={
                stats.totalExams > 0
                  ? `${(
                      (stats.pendingAnalysis / stats.totalExams) *
                      100
                    ).toFixed(1)}% dos exames`
                  : "0% dos exames"
              }
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gráfico de Linha - Exames Mensais */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp size={20} className="mr-2 text-blue-600" />
                Exames Mensais
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="exams"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    name="Total de Exames"
                  />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                    name="Casos Positivos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Pizza - Resultados */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye size={20} className="mr-2 text-purple-600" />
                Distribuição de Resultados
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={resultData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resultData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, "Exames"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Exames Recentes */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText size={20} className="mr-2 text-green-600" />
                Exames Recentes
              </h3>
              <button
                onClick={() => router.push("/exams/")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Ver todos
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Paciente
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Data
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Resultado
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Confiança
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentExams.map((exam) => (
                    <tr
                      key={exam.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          {exam.patientName}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(exam.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-4 px-4">
                        <ExamStatusBadge result={exam.result} />
                      </td>
                      <td className="py-4 px-4">
                        {exam.confidence ? (
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${exam.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              {exam.confidence}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => router.push("/exams/" + exam.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PrivateRoute>
  );
}
