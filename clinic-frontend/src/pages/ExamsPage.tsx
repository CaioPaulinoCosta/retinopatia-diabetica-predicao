import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faExclamationTriangle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useExams } from "../hooks/useExams";
import ExamForm from "../components/exams/ExamForm";
import type { Exam } from "../types";
import { Link } from "react-router-dom";

export default function ExamsPage() {
  const { exams, isLoading, error, createExam, isCreating } = useExams();

  const [showForm, setShowForm] = useState(false);

  console.log("🔬 DEBUG - ExamsPage state:", {
    examsCount: exams?.length,
    isLoading,
    error: error?.message,
    showForm,
  });

  const handleCreateExam = async (examData: FormData) => {
    console.log("🆕 DEBUG - Creating exam with data:", examData);
    try {
      await createExam(examData);
      setShowForm(false);
      console.log("✅ DEBUG - Exam created successfully");
    } catch (error) {
      console.error("❌ DEBUG - Error creating exam:", error);
      alert("Erro ao criar exame. Verifique o console para detalhes.");
    }
  };

  // Estado de erro
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-500 text-6xl mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro ao carregar exames
          </h2>
          <p className="text-gray-600 mb-4">
            Não foi possível conectar com a API.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <p className="text-sm text-gray-700">
              <strong>URL da API:</strong> http://localhost:8002/api/exams
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Erro:</strong>{" "}
              {(error as Error)?.message || "Erro desconhecido"}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando exames...</p>
          <p className="text-sm text-gray-500 mt-2">
            Conectando com a API em: http://localhost:8002/api/exams
          </p>
        </div>
      </div>
    );
  }

  // Formulário de criação
  if (showForm) {
    return (
      <div className="p-6">
        <ExamForm
          onSubmit={handleCreateExam}
          onCancel={() => {
            console.log("🚪 DEBUG - Cancel exam form");
            setShowForm(false);
          }}
          isLoading={isCreating}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FontAwesomeIcon icon={faMicroscope} className="text-blue-600" />
            Exames
          </h1>
          <p className="text-gray-600 mt-1">
            {exams.length} exame(s) cadastrado(s)
          </p>
        </div>
        <button
          onClick={() => {
            console.log("🆕 DEBUG - Opening exam form");
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Novo Exame
        </button>
      </div>

      {/* Lista de exames */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lista de Exames
        </h3>

        {exams.length === 0 ? (
          <div className="text-center py-8">
            <FontAwesomeIcon
              icon={faMicroscope}
              className="text-gray-400 text-4xl mb-4"
            />
            <p className="text-gray-600">Nenhum exame cadastrado</p>
            <p className="text-sm text-gray-500 mt-1">
              Comece cadastrando o primeiro exame
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                to={`/exams/${exam.id}`}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors block"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {exam.exam_type} -{" "}
                      {exam.patient?.name || `Paciente ID: ${exam.patient_id}`}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Data:{" "}
                      {new Date(exam.exam_date).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:
                      <span
                        className={`ml-1 ${
                          exam.status === "completed"
                            ? "text-green-600"
                            : exam.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {exam.status === "completed"
                          ? "Concluído"
                          : exam.status === "pending"
                          ? "Pendente"
                          : "Cancelado"}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">ID: {exam.id}</p>
                  </div>
                </div>
                {exam.description && (
                  <p className="text-sm text-gray-700 mt-2">
                    {exam.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* DEBUG INFO - Remover em produção */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <details>
          <summary className="cursor-pointer font-medium text-gray-700">
            🔬 DEBUG Info (Desenvolvimento)
          </summary>
          <pre className="mt-2 text-xs bg-white p-2 rounded border">
            {JSON.stringify(exams, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}
