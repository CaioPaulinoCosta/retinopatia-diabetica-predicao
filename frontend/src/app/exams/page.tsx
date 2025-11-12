"use client";
import Link from "next/link";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PrivateRoute from "@/components/Auth/PrivateRoutes";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getExams, deleteExam, Exam } from "@/services/exams";
import { formatDate } from "@/utils/dateUtils";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  MoreVertical,
  X,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Image,
} from "lucide-react";

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchExams() {
      try {
        const data = await getExams();
        setExams(data);
        setFilteredExams(data);
      } catch (error) {
        console.error("Erro ao carregar exames:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExams();
  }, []);

  useEffect(() => {
    let filtered = exams.filter(
      (exam) =>
        exam.exam_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter((exam) => exam.status === statusFilter);
    }

    setFilteredExams(filtered);
  }, [searchTerm, statusFilter, exams]);

  async function handleDelete(id: number) {
    try {
      await deleteExam(id);
      setExams((prev) => prev.filter((e) => e.id !== id));
      setExamToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir exame:", error);
      alert("Erro ao excluir exame.");
    }
  }

  // Fechar modal quando clicar fora ou pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExamToDelete(null);
      }
    };

    if (examToDelete) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [examToDelete]);

  const getStatusConfig = (status: string) => {
    const config = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Pendente",
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Concluído",
      },
      analyzing: {
        color: "bg-blue-100 text-blue-800",
        icon: Clock,
        label: "Analisando",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        label: "Cancelado",
      },
    };
    return (
      config[status as keyof typeof config] || {
        color: "bg-gray-100 text-gray-800",
        icon: FileText,
        label: status,
      }
    );
  };

  const getResultBadge = (exam: Exam) => {
    if (!exam.result) return null;

    const isPositive = exam.result.diagnosis !== "No_DR";
    const confidence = exam.result.probability_dr
      ? Math.round(exam.result.probability_dr * 100)
      : 0;

    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isPositive ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}
      >
        {isPositive ? "Positivo" : "Negativo"} ({confidence}%)
      </div>
    );
  };

  const ExamCard = ({ exam }: { exam: Exam }) => {
    const statusConfig = getStatusConfig(exam.status);
    const StatusIcon = statusConfig.icon;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                  {exam.exam_type}
                </h3>
                <p className="text-sm text-gray-500">ID: {exam.id}</p>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowMenu(showMenu === exam.id ? null : exam.id)
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical size={16} className="text-gray-400" />
              </button>

              {showMenu === exam.id && (
                <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[140px]">
                  <Link
                    href={`/exams/${exam.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(null)}
                  >
                    <Eye size={14} className="mr-2" />
                    Visualizar
                  </Link>
                  <Link
                    href={`/exams/${exam.id}/edit`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(null)}
                  >
                    <Edit size={14} className="mr-2" />
                    Editar
                  </Link>
                  <button
                    onClick={() => {
                      setExamToDelete(exam);
                      setShowMenu(null);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {exam.image_path && (
            <div className="mb-4 rounded-xl overflow-hidden border border-gray-200">
              <img
                src={exam.image_path}
                alt={exam.exam_type}
                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          {/* Exam Info */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <User size={14} className="mr-2 text-blue-500" />
                <span className="text-sm font-medium">
                  {exam.patient?.name || "Paciente não identificado"}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar size={14} className="mr-2 text-green-500" />
              <span className="text-sm">{formatDate(exam.exam_date)}</span>
            </div>

            {exam.description && (
              <div className="text-sm text-gray-600 line-clamp-2">
                {exam.description}
              </div>
            )}
          </div>

          {/* Status and Result */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
            >
              <StatusIcon size={12} className="mr-1" />
              {statusConfig.label}
            </span>
            {getResultBadge(exam)}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Link
              href={`/exams/${exam.id}`}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center transition-colors"
            >
              <Eye size={14} className="mr-1" />
              Ver detalhes
            </Link>
            <div className="flex space-x-2">
              <Link
                href={`/exams/${exam.id}/edit`}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit size={14} />
              </Link>
              <button
                onClick={() => setExamToDelete(exam)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Header />
          <main className="flex-1 p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="h-24 bg-gray-200 rounded mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />

        <main className="flex-1 p-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <FileText size={32} className="mr-3 text-blue-600" />
                  Gerenciar Exames
                </h1>
                <p className="text-gray-600">
                  {exams.length} exame(s) cadastrado(s)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Buscar exames..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 transition-all"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="all">Todos os status</option>
                    <option value="pending">Pendente</option>
                    <option value="completed">Concluído</option>
                    <option value="analyzing">Analisando</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <button
                  onClick={() => router.push("/exams/new")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} className="mr-2" />
                  Novo Exame
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">
                  {exams.length}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-green-600">
                  {exams.filter((e) => e.status === "completed").length}
                </div>
                <div className="text-sm text-gray-500">Concluídos</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    exams.filter(
                      (e) => e.status === "pending" || e.status === "analyzing"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-500">Pendentes</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-red-600">
                  {
                    exams.filter(
                      (e) => e.result && e.result.diagnosis !== "No_DR"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-500">Positivos</div>
              </div>
            </div>

            {/* Content */}
            {filteredExams.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm">
                  <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all"
                      ? "Nenhum exame encontrado"
                      : "Nenhum exame cadastrado"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || statusFilter !== "all"
                      ? "Tente ajustar os filtros de busca."
                      : "Comece cadastrando seu primeiro exame."}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <button
                      onClick={() => router.push("/exams/new")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center transition-colors"
                    >
                      <Plus size={20} className="mr-2" />
                      Cadastrar Primeiro Exame
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredExams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {examToDelete && (
            <>
              {/* Backdrop com blur sutil */}
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-300"
                onClick={() => setExamToDelete(null)}
              />

              {/* Modal no topo da tela */}
              <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md animate-in slide-in-from-top-8 duration-300">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mx-4">
                  {/* Header do Modal */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle size={20} className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Excluir Exame
                        </h3>
                        <p className="text-sm text-gray-500">
                          Ação irreversível
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExamToDelete(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Conteúdo do Modal */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-2">
                      Você está prestes a excluir o exame:
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-red-900">
                            {examToDelete.exam_type}
                          </p>
                          <p className="text-sm text-red-600">
                            Paciente:{" "}
                            {examToDelete.patient?.name || "Não identificado"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle
                          size={16}
                          className="text-amber-600 mt-0.5 flex-shrink-0"
                        />
                        <p className="text-sm text-amber-800">
                          <strong>Atenção:</strong> Todas as análises e
                          resultados associados a este exame serão
                          permanentemente excluídos.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <button
                        onClick={() => setExamToDelete(null)}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors flex-1 sm:flex-none text-center"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDelete(examToDelete.id)}
                        className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors flex items-center justify-center flex-1 sm:flex-none"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Excluir Permanentemente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </PrivateRoute>
  );
}
