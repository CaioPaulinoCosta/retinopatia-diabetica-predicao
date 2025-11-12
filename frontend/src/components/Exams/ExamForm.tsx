"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createExam } from "@/services/exams";
import { getPatients } from "@/services/patients";
import type { Patient } from "@/services/patients";
import { api } from "@/lib/api";
import Alert from "@/components/Alert";
import { useAlert } from "@/hooks/useAlert";
import {
  Upload,
  User,
  FileText,
  Calendar,
  Stethoscope,
  ArrowLeft,
  Plus,
  Clock,
  Info,
} from "lucide-react";

export default function NewExamPage() {
  const router = useRouter();
  const { alert, showAlert, hideAlert } = useAlert();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    patient_id: "",
    exam_type: "",
    description: "",
    exam_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Buscar pacientes cadastrados
  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error("Erro ao carregar pacientes:", err);
        showAlert("error", "Erro ao carregar lista de pacientes.");
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, [showAlert]);

  // Atualizar campos do formulário
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  function removeFile() {
    setFile(null);
    setFilePreview(null);
  }

  // Enviar formulário
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!file) {
      showAlert("warning", "Selecione uma imagem para o exame.");
      return;
    }

    if (!formData.patient_id) {
      showAlert("warning", "Selecione um paciente.");
      return;
    }

    try {
      setSubmitting(true);

      // Obtém o usuário autenticado
      const { data: userResponse } = await api.get("/auth/me");
      const userId = userResponse.id;

      const data = new FormData();
      data.append("patient_id", String(formData.patient_id));
      data.append("exam_type", formData.exam_type);
      data.append("description", formData.description);
      data.append("exam_date", formData.exam_date);
      data.append("notes", formData.notes || "");
      data.append("user_id", String(userId));
      data.append("image", file);

      console.log("Dados do formulário:");
      console.log(Array.from(data.entries()));

      await createExam(data);

      showAlert("success", "Exame criado com sucesso!");

      // Redireciona após um breve delay para mostrar o alerta
      setTimeout(() => {
        router.push("/exams");
      }, 1500);
    } catch (err) {
      console.error("Erro ao criar exame:", err);
      showAlert(
        "error",
        "Erro ao criar exame. Verifique os dados e tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
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

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all duration-200"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Stethoscope size={32} className="mr-3 text-blue-600" />
                Novo Exame
              </h1>
              <p className="text-gray-600 mt-1">
                Cadastre um novo exame de retinopatia diabética
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
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
                    value={formData.patient_id}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione um paciente</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} {p.email ? `(${p.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo do Exame */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <FileText size={16} className="mr-2 text-blue-600" />
                    Tipo de Exame *
                  </label>
                  <input
                    type="text"
                    name="exam_type"
                    value={formData.exam_type}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Retinografia, Fundoscopia, etc."
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Data do Exame */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Calendar size={16} className="mr-2 text-blue-600" />
                    Data do Exame *
                  </label>
                  <input
                    type="date"
                    name="exam_date"
                    value={formData.exam_date}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Descreva o exame realizado..."
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Observações
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Observações adicionais..."
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>

                {/* Upload da Imagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Upload size={16} className="mr-2 text-blue-600" />
                    Imagem do Exame *
                  </label>

                  {filePreview ? (
                    <div className="border-2 border-dashed border-green-300 rounded-xl p-4 bg-green-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-green-700 font-medium">
                          Imagem selecionada
                        </span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remover
                        </button>
                      </div>
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload
                        size={32}
                        className="mx-auto text-gray-400 mb-2"
                      />
                      <p className="text-gray-600 mb-2">
                        Clique para selecionar uma imagem
                      </p>
                      <p className="text-gray-500 text-sm">
                        Formatos: JPG, PNG, GIF
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors flex-1 text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 flex-1 ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Clock size={20} className="mr-2 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <Plus size={20} className="mr-2" />
                        Cadastrar Exame
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
                <li>• Selecione uma imagem de boa qualidade</li>
                <li>• Verifique os dados do paciente</li>
                <li>• Preencha a data correta do exame</li>
                <li>• Após o cadastro, você poderá analisar o exame com IA</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-semibold text-amber-900 mb-2">
                Sobre a Análise
              </h3>
              <p className="text-amber-800 text-sm">
                Após o cadastro, você poderá usar nossa IA para analisar
                automaticamente a imagem e detectar possíveis sinais de
                retinopatia diabética.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
