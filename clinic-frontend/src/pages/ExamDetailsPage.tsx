import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMicroscope,
  faUser,
  faCalendar,
  faFilePdf,
  faDownload,
  faSpinner,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useExamResultByExamId } from "../hooks/useExamResults"; // ← Hook correto
import { examsService } from "../services/exams";
import { resultsService } from "../services/results"; // ← Importar serviço diretamente
import type { Exam } from "../types";

export default function ExamDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const examId = parseInt(id || "0");

  const {
    result,
    isLoading: isLoadingResult,
    error: resultError,
    refetch: refetchResult, // ← Adicionar refetch para atualizar após análise
  } = useExamResultByExamId(examId);

  // Carregar dados do exame
  useEffect(() => {
    const loadExam = async () => {
      if (!examId) {
        setError("ID do exame inválido");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const examData = await examsService.getById(examId);
        setExam(examData);
      } catch (err) {
        console.error("❌ DEBUG - Error loading exam:", err);
        setError("Erro ao carregar exame");
      } finally {
        setIsLoading(false);
      }
    };

    loadExam();
  }, [examId]);

  // Função para gerar PDF (placeholder)
  const generatePDF = () => {
    console.log("📄 DEBUG - Generating PDF for exam:", examId);
    // TODO: Implementar geração de PDF
    alert("Funcionalidade de PDF em desenvolvimento!");
  };

  // Função para analisar exame com ML API
  const analyzeWithML = async () => {
    if (!examId) return;

    try {
      setIsAnalyzing(true);
      console.log("🔬 DEBUG - Analyzing exam with ML:", examId);

      // Chama a análise com ML API
      const analysisResult = await resultsService.analyzeExam(examId);
      console.log("✅ DEBUG - Analysis completed:", analysisResult);

      // Atualiza a lista de exames e resultados
      await refetchResult();

      // Recarrega os dados do exame para atualizar o status
      const updatedExam = await examsService.getById(examId);
      setExam(updatedExam);

      alert("Análise concluída com sucesso!");
    } catch (error) {
      console.error("❌ DEBUG - Error analyzing exam:", error);
      alert("Erro ao analisar exame: " + (error as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando exame...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-500 text-6xl mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Exame não encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "O exame solicitado não existe."}
          </p>
          <button
            onClick={() => navigate("/exams")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Voltar para Exames
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/exams"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Voltar para Exames
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FontAwesomeIcon icon={faMicroscope} className="text-blue-600" />
              Detalhes do Exame
            </h1>
            <p className="text-gray-600 mt-1">ID: {exam.id}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generatePDF}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faFilePdf} />
              Gerar PDF
            </button>

            {exam.status === "pending" && (
              <button
                onClick={analyzeWithML}
                disabled={isAnalyzing}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />
                    Analisando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faMicroscope} />
                    Analisar com IA
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Exame */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Informações Básicas */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faMicroscope} className="text-blue-600" />
              Informações do Exame
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Exame
                </label>
                <p className="text-gray-900 font-medium">{exam.exam_type}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Exame
                </label>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-gray-400"
                  />
                  {new Date(exam.exam_date).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    exam.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : exam.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {exam.status === "completed"
                    ? "Concluído"
                    : exam.status === "pending"
                    ? "Pendente"
                    : "Cancelado"}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Criação
                </label>
                <p className="text-gray-600 text-sm">
                  {new Date(exam.created_at!).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            {exam.description && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <p className="text-gray-700">{exam.description}</p>
              </div>
            )}

            {exam.notes && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionais
                </label>
                <p className="text-gray-700">{exam.notes}</p>
              </div>
            )}
          </div>

          {/* Card: Imagem do Exame */}
          {exam.image_url && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Imagem do Exame
              </h2>
              <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                <img
                  src={exam.image_url}
                  alt="Exame de retina"
                  className="max-w-full max-h-96 rounded-lg shadow-md"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <a
                  href={exam.image_url}
                  download={`exame-${exam.id}.jpg`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Baixar Imagem
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Card: Informações do Paciente */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-green-600" />
              Paciente
            </h2>

            {exam.patient ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <p className="text-gray-900 font-medium">
                    {exam.patient.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-600">{exam.patient.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <p className="text-gray-600">
                    {exam.patient.phone || "Não informado"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diabetes
                  </label>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      exam.patient.has_diabetes
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {exam.patient.has_diabetes
                      ? "Com diabetes"
                      : "Sem diabetes"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                Carregando informações do paciente...
              </p>
            )}
          </div>

          {/* Card: Resultado da Análise */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resultado da Análise
            </h2>

            {isLoadingResult ? (
              <div className="text-center py-4">
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="animate-spin text-blue-600 text-xl mb-2"
                />
                <p className="text-gray-600">Carregando resultado...</p>
              </div>
            ) : resultError ? (
              <div className="text-center py-4">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-yellow-500 text-xl mb-2"
                />
                <p className="text-gray-600">Erro ao carregar resultado</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 ${
                      result.diagnosis === "No_DR"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        result.diagnosis === "No_DR"
                          ? faCheckCircle
                          : faTimesCircle
                      }
                      className="text-2xl"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {result.diagnosis === "No_DR"
                      ? "Sem Retinopatia Diabética"
                      : "Com Retinopatia Diabética"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {result.probability_no_dr &&
                      `Probabilidade: ${(
                        result.probability_no_dr * 100
                      ).toFixed(1)}%`}
                    {result.probability_dr &&
                      ` / DR: ${(result.probability_dr * 100).toFixed(1)}%`}
                  </p>
                </div>

                {/* Probabilidades */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Probabilidades:
                  </label>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Sem Retinopatia (No_DR):
                      </span>
                      <span className="font-medium text-green-600">
                        {result.probability_no_dr
                          ? (result.probability_no_dr * 100).toFixed(1) + "%"
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Com Retinopatia (DR):
                      </span>
                      <span className="font-medium text-red-600">
                        {result.probability_dr
                          ? (result.probability_dr * 100).toFixed(1) + "%"
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {result.recommendation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recomendação:
                    </label>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                      {result.recommendation}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Tipo:{" "}
                    {result.is_auto_diagnosis
                      ? "Análise Automática (IA)"
                      : "Diagnóstico Manual"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Data da análise:{" "}
                    {result.analyzed_at
                      ? new Date(result.analyzed_at).toLocaleDateString("pt-BR")
                      : "N/A"}
                  </p>
                  {result.class_predicted && (
                    <p className="text-xs text-gray-500">
                      Classe predita: {result.class_predicted}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="text-yellow-500 text-xl mb-2"
                />
                <p className="text-gray-600">Nenhum resultado disponível</p>
                <p className="text-sm text-gray-500 mt-1">
                  Este exame ainda não foi analisado
                </p>
                {exam.status === "pending" && (
                  <button
                    onClick={analyzeWithML}
                    disabled={isAnalyzing}
                    className="mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    {isAnalyzing ? "Analisando..." : "Analisar com IA"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
