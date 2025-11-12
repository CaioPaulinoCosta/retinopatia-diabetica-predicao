"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PrivateRoute from "@/components/Auth/PrivateRoutes";
import { getExam, analyzeExam } from "@/services/exams";
import { formatDateForDisplay } from "@/utils/dateUtils";
import {
  Calendar,
  User,
  FileText,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  TrendingUp,
  Brain,
  Download,
  RotateCcw,
} from "lucide-react";

export default function ExamAnalysisPage() {
  const { id } = useParams();
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function getDRLevel(probability_dr: number) {
    if (probability_dr < 0.2) return "No DR";
    if (probability_dr < 0.4) return "Leve";
    if (probability_dr < 0.6) return "Moderado";
    if (probability_dr < 0.8) return "Severo";
    return "DR Proliferativo";
  }

  function getDRLevelColor(level: string) {
    const colors = {
      "No DR": "bg-green-100 text-green-800 border-green-200",
      Leve: "bg-blue-100 text-blue-800 border-blue-200",
      Moderado: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Severo: "bg-orange-100 text-orange-800 border-orange-200",
      "DR Proliferativo": "bg-red-100 text-red-800 border-red-200",
    };
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800";
  }

  async function fetchExamData() {
    if (!id) return;

    try {
      const examId = Array.isArray(id) ? Number(id[0]) : Number(id);
      const data = await getExam(examId);

      // Verifica se vem exam dentro de data
      const examData = (data as any).exam ?? data;
      setExam(examData);

      // Verifica se há result dentro da resposta - CORREÇÃO AQUI
      if (examData.result) {
        setAnalysisResult(examData.result);
      } else if ((data as any).result) {
        setAnalysisResult((data as any).result);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar exame.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExamData();
  }, [id]);

  async function handleAnalyzeExam() {
    // Evita reanálise
    if (analysisResult) {
      alert("Este exame já foi analisado.");
      return;
    }

    // Validações básicas
    if (!exam?.id || !exam?.image_path) {
      alert("Exame inválido ou sem imagem.");
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);

      // Chama o service
      const result = await analyzeExam(exam.id);

      // CORREÇÃO: Atualiza os dados do exame após análise
      await fetchExamData();
    } catch (err) {
      console.error(err);
      setError("Erro ao analisar exame. Tente novamente.");
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Carregando exame...</p>
          </div>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <main className="flex-1 p-6 min-h-screen">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <Eye size={32} className="mr-3 text-blue-600" />
                  Análise de Exame
                </h1>
                <p className="text-gray-600">
                  Detalhes e resultados do exame de retinopatia diabética
                </p>
              </div>

              {analysisResult && (
                <button className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl font-medium transition-colors">
                  <Download size={16} className="mr-2" />
                  Exportar Laudo
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle size={20} className="text-red-600 mr-2" />
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Coluna da Esquerda - Informações do Exame */}
              <div className="lg:col-span-1 space-y-6">
                {/* Card de Informações do Exame */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText size={20} className="mr-2 text-blue-600" />
                    Informações do Exame
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Tipo de Exame</span>
                      <span className="font-medium text-gray-900">
                        {exam?.exam_type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Data</span>
                      <span className="font-medium text-gray-900 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDateForDisplay(exam?.exam_date)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          exam?.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : exam?.status === "analyzing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {exam?.status === "completed" && (
                          <CheckCircle size={12} className="mr-1" />
                        )}
                        {exam?.status === "analyzing" && (
                          <Clock size={12} className="mr-1" />
                        )}
                        {exam?.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Paciente</span>
                      <span className="font-medium text-gray-900 flex items-center">
                        <User size={14} className="mr-1" />
                        {exam?.patient?.name}
                      </span>
                    </div>

                    {exam?.description && (
                      <div className="pt-2">
                        <span className="text-gray-600 block mb-1">
                          Descrição
                        </span>
                        <p className="text-gray-900 text-sm">
                          {exam.description}
                        </p>
                      </div>
                    )}

                    {exam?.notes && (
                      <div className="pt-2">
                        <span className="text-gray-600 block mb-1">
                          Observações
                        </span>
                        <p className="text-gray-900 text-sm">{exam.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botão de Análise */}
                {!analysisResult && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="text-center">
                      <Brain size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Análise Pendente
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Este exame ainda não foi analisado pela IA. Clique no
                        botão abaixo para iniciar a análise.
                      </p>
                      <button
                        onClick={handleAnalyzeExam}
                        disabled={analyzing}
                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 ${
                          analyzing
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {analyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analisando...
                          </>
                        ) : (
                          <>
                            <Activity size={20} className="mr-2" />
                            Iniciar Análise com IA
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Coluna da Direita - Imagem e Resultados */}
              <div className="lg:col-span-2 space-y-6">
                {/* Imagem do Exame */}
                {exam?.image_path && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Eye size={20} className="mr-2 text-blue-600" />
                      Imagem do Exame
                    </h2>
                    <div className="relative">
                      <img
                        src={exam.image_path}
                        alt="Imagem do Exame de Retinopatia Diabética"
                        className="w-full h-auto max-h-96 object-contain rounded-xl border border-gray-200"
                      />
                      {analyzing && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p>Processando imagem...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Resultado da Análise */}
                {analysisResult && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <BarChart3 size={20} className="mr-2 text-green-600" />
                        Resultado da Análise
                      </h2>
                      <span className="text-xs text-gray-500">
                        Processado por IA
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Diagnóstico Principal */}
                      <div
                        className={`p-4 rounded-xl border-2 ${
                          analysisResult.diagnosis === "No_DR"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {analysisResult.diagnosis === "No_DR" ? (
                            <CheckCircle
                              size={20}
                              className="text-green-600 mr-2"
                            />
                          ) : (
                            <AlertTriangle
                              size={20}
                              className="text-red-600 mr-2"
                            />
                          )}
                          <span className="font-semibold text-gray-900">
                            Diagnóstico
                          </span>
                        </div>
                        <p
                          className={`text-lg font-bold ${
                            analysisResult.diagnosis === "No_DR"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {analysisResult.diagnosis === "No_DR"
                            ? "Negativo para Retinopatia Diabética"
                            : "Positivo para Retinopatia Diabética"}
                        </p>
                      </div>

                      {/* Nível de DR */}
                      <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <TrendingUp
                            size={20}
                            className="text-blue-600 mr-2"
                          />
                          <span className="font-semibold text-gray-900">
                            Nível Estimado
                          </span>
                        </div>
                        <p
                          className={`text-lg font-bold text-blue-700 ${getDRLevelColor(
                            getDRLevel(analysisResult.probability_dr)
                          )} px-3 py-1 rounded-full inline-block`}
                        >
                          {getDRLevel(analysisResult.probability_dr)}
                        </p>
                      </div>
                    </div>

                    {/* Probabilidades */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Probabilidades
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Probabilidade de DR</span>
                            <span>
                              {(analysisResult.probability_dr * 100).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-600 h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${
                                  analysisResult.probability_dr * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Probabilidade de não DR</span>
                            <span>
                              {(analysisResult.probability_no_dr * 100).toFixed(
                                1
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${
                                  analysisResult.probability_no_dr * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recomendação */}
                    {analysisResult.recommendation && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-start">
                          <AlertTriangle
                            size={18}
                            className="text-amber-600 mr-2 mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-semibold text-amber-900 mb-1">
                              Recomendação
                            </h4>
                            <p className="text-amber-800 text-sm">
                              {analysisResult.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PrivateRoute>
  );
}
