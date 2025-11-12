"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PrivateRoute from "@/components/Auth/PrivateRoutes";
import { getExam, updateExam, Exam } from "@/services/exams";
import { getPatients } from "@/services/patients";
import { formatDateForInput } from "@/utils/dateUtils";
import Alert from "@/components/Alert";
import { useAlert } from "@/hooks/useAlert";
import {
  ArrowLeft,
  Save,
  Clock,
  Upload,
  User,
  FileText,
  Calendar,
  Eye,
  Image as ImageIcon,
  Info,
  AlertTriangle,
} from "lucide-react";

export default function EditExamPage() {
  const router = useRouter();
  const { id } = useParams();
  const { alert, showAlert, hideAlert } = useAlert();
  const [exam, setExam] = useState<Partial<Exam>>({});
  const [patients, setPatients] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExamAndPatients() {
      if (!id) {
        showAlert("error", "ID do exame não encontrado");
        setLoading(false);
        return;
      }

      const examId = Array.isArray(id) ? Number(id[0]) : Number(id);
      if (isNaN(examId)) {
        showAlert("error", "ID do exame inválido");
        setLoading(false);
        return;
      }

      try {
        const [examData, patientsData] = await Promise.all([
          getExam(examId),
          getPatients(),
        ]);

        setExam(examData);
        setPatients(patientsData);

        // Se já existe uma imagem, criar preview
        if (examData.image_path) {
          setFilePreview(examData.image_path);
        }
      } catch (err) {
        console.error(err);
        showAlert("error", "Erro ao carregar dados do exame.");
      } finally {
        setLoading(false);
      }
    }

    fetchExamAndPatients();
  }, [id, showAlert]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setExam((prev) => ({
      ...prev,
      [name]: name === "patient_id" ? Number(value) : value,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Criar preview da nova imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  function removeFile() {
    setFile(null);
    setFilePreview(exam.image_path || null); // Volta para a imagem original
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      // Adicionar campos do formulário
      Object.entries(exam).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "image_path") {
          formData.append(key, value as any);
        }
      });

      // Adicionar nova imagem se foi selecionada
      if (file) {
        formData.append("image", file);
      }

      await updateExam(Number(id), formData);

      showAlert("success", "Exame atualizado com sucesso!");

      // Redireciona após um breve delay para mostrar o alerta
      setTimeout(() => {
        router.push("/exams");
      }, 1500);
    } catch (err) {
      console.error(err);
      showAlert("error", "Erro ao atualizar exame. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do exame...</p>
          </div>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Alert Component */}
        {alert.visible && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={hideAlert}
            duration={alert.type === "success" ? 3000 : 5000}
          />
        )}

        <main className="flex-1 p-6 min-h-screen">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/exams")}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-200"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <FileText size={32} className="mr-3 text-blue-600" />
                    Editar Exame
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Atualize as informações do exame de retinopatia diabética
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push(`/exams/${id}`)}
                className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl font-medium transition-colors"
              >
                <Eye size={16} className="mr-2" />
                Ver Exame
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulário Principal */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Paciente */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <User size={16} className="mr-2 text-blue-600" />
                        Paciente *
                      </label>
                      <select
                        name="patient_id"
                        value={exam.patient_id || ""}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Selecione um paciente</option>
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tipo de Exame e Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <FileText size={16} className="mr-2 text-blue-600" />
                          Tipo de Exame *
                        </label>
                        <input
                          type="text"
                          name="exam_type"
                          value={exam.exam_type || ""}
                          onChange={handleChange}
                          required
                          placeholder="Ex: Retinografia, Fundoscopia, etc."
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                          <Calendar size={16} className="mr-2 text-blue-600" />
                          Data do Exame *
                        </label>
                        <input
                          type="date"
                          name="exam_date"
                          value={formatDateForInput(exam.exam_date || "")}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Descrição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Descrição
                      </label>
                      <textarea
                        name="description"
                        value={exam.description || ""}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Descreva o exame realizado..."
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Observações */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Observações
                      </label>
                      <textarea
                        name="notes"
                        value={exam.notes || ""}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Observações adicionais sobre o exame..."
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Upload da Imagem */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <Upload size={16} className="mr-2 text-blue-600" />
                        Imagem do Exame
                      </label>

                      {filePreview ? (
                        <div className="border-2 border-dashed border-green-300 rounded-xl p-4 bg-green-50">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-green-700 font-medium">
                              {file
                                ? "Nova imagem selecionada"
                                : "Imagem atual"}
                            </span>
                            <button
                              type="button"
                              onClick={removeFile}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              {file ? "Remover" : "Alterar"}
                            </button>
                          </div>
                          <img
                            src={filePreview}
                            alt="Preview do exame"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {file && (
                            <p className="text-green-600 text-sm mt-2">
                              ✅ Nova imagem será salva
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                          <ImageIcon
                            size={32}
                            className="mx-auto text-gray-400 mb-2"
                          />
                          <p className="text-gray-600 mb-2">
                            Clique para alterar a imagem
                          </p>
                          <p className="text-gray-500 text-sm">
                            Formatos: JPG, PNG, GIF
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => router.push("/exams")}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors flex-1 text-center"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 flex-1 ${
                          saving
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {saving ? (
                          <>
                            <Clock size={20} className="mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save size={20} className="mr-2" />
                            Salvar Alterações
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Informações Laterais */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Info size={18} className="mr-2" />
                    Informações Importantes
                  </h3>
                  <ul className="text-blue-800 text-sm space-y-2">
                    <li>• Campos marcados com * são obrigatórios</li>
                    <li>• A data deve ser a real do exame</li>
                    <li>• A imagem atual será mantida se não alterar</li>
                    <li>• Descrições detalhadas ajudam na análise</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <AlertTriangle size={18} className="mr-2" />
                    Sobre a Imagem
                  </h3>
                  <p className="text-amber-800 text-sm">
                    Ao alterar a imagem, a análise existente será mantida, mas
                    você poderá realizar uma nova análise com a imagem
                    atualizada.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Status do Exame
                  </h3>
                  <div className="text-green-800 text-sm space-y-2">
                    <p>
                      <strong>Status atual:</strong>{" "}
                      {exam.status || "Não definido"}
                    </p>
                    {exam.result && (
                      <p>
                        <strong>Análise:</strong>{" "}
                        {exam.result.diagnosis === "No_DR"
                          ? "Negativa"
                          : "Positiva"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PrivateRoute>
  );
}
