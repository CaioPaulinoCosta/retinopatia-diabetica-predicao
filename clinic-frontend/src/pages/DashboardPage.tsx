import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMicroscope,
  faCalendar,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faChartLine,
  faChartBar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useDashboard } from "../hooks/useDashboard";
import { DiagnosisChart } from "../components/dashboard/DiagnosisChart";
import { MonthlyTrendsChart } from "../components/dashboard/MonthlyTrendsChart";
import type { RiskPatient } from "../types/dashboard"; // Import adicionado

export default function DashboardPage() {
  const { dashboardData, isLoading } = useDashboard();

  const stats = dashboardData?.stats ?? {
    totalPatients: 0,
    totalExams: 0,
    examsThisMonth: 0,
    pendingExams: 0,
    completedExams: 0,
    positiveDiagnosis: 0,
    negativeDiagnosis: 0,
    diabetesPatients: 0,
  };

  const monthlyTrends = dashboardData?.monthlyTrends ?? [];
  const riskPatients = dashboardData?.riskPatients ?? [];
  const diagnosisDistribution = dashboardData?.diagnosisDistribution ?? {
    No_DR: 0,
    Mild: 0,
    Moderate: 0,
    Severe: 0,
    Proliferative: 0,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FontAwesomeIcon icon={faChartLine} className="text-blue-600" />
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Visão geral do sistema e métricas importantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Pacientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Pacientes
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalPatients}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-blue-600 text-xl"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <FontAwesomeIcon icon={faChartLine} className="mr-1" />
            <span>+12% este mês</span>
          </div>
        </div>

        {/* Total de Exames */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Exames
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalExams}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faMicroscope}
                className="text-green-600 text-xl"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <FontAwesomeIcon icon={faCalendar} className="mr-1" />
            <span>{stats.examsThisMonth} este mês</span>
          </div>
        </div>

        {/* Exames Pendentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Exames Pendentes
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.pendingExams}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faClock}
                className="text-yellow-600 text-xl"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
            <span>Necessitam análise</span>
          </div>
        </div>

        {/* Diagnósticos Positivos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Retinopatia Detectada
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.positiveDiagnosis}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="text-red-600 text-xl"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>
              {(
                (stats.positiveDiagnosis / stats.completedExams) * 100 || 0
              ).toFixed(1)}
              % dos exames
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de Distribuição de Diagnósticos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faChartBar} className="text-blue-600" />
              Distribuição de Diagnósticos
            </h2>
            <DiagnosisChart distribution={diagnosisDistribution} />
          </div>
        </div>

        {/* Pacientes de Risco */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="text-red-600" />
            Pacientes de Risco
          </h2>
          <div className="space-y-4">
            {riskPatients.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum paciente de risco identificado
              </p>
            ) : (
              riskPatients.map((patient: RiskPatient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {patient.name}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {patient.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Último exame:{" "}
                      {new Date(patient.lastExamDate).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        patient.riskLevel === "high"
                          ? "bg-red-100 text-red-800"
                          : patient.riskLevel === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {patient.riskLevel === "high"
                        ? "Alto"
                        : patient.riskLevel === "medium"
                        ? "Médio"
                        : "Baixo"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tendências Mensais */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faChartLine} className="text-green-600" />
          Tendências Mensais
        </h2>
        <MonthlyTrendsChart trends={monthlyTrends} />
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-500 text-3xl mb-3"
          />
          <h3 className="font-semibold text-gray-900">Exames Concluídos</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {stats.completedExams}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {((stats.completedExams / stats.totalExams) * 100 || 0).toFixed(1)}%
            do total
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="text-red-500 text-3xl mb-3"
          />
          <h3 className="font-semibold text-gray-900">Sem Retinopatia</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {stats.negativeDiagnosis}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {(
              (stats.negativeDiagnosis / stats.completedExams) * 100 || 0
            ).toFixed(1)}
            % dos concluídos
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <FontAwesomeIcon
            icon={faUser}
            className="text-blue-500 text-3xl mb-3"
          />
          <h3 className="font-semibold text-gray-900">
            Pacientes com Diabetes
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {stats.diabetesPatients || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {(
              ((stats.diabetesPatients || 0) / stats.totalPatients) * 100 || 0
            ).toFixed(1)}
            % do total
          </p>
        </div>
      </div>
    </div>
  );
}
