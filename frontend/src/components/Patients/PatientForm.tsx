"use client";

import { useState, FormEvent, useEffect } from "react";
import {
  Patient,
  createPatient,
  updatePatient,
  getPatient,
} from "@/services/patients";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";
import { useAlert } from "@/hooks/useAlert";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  AlertTriangle,
  Pill,
  Shield,
  Stethoscope,
  Save,
  ArrowLeft,
  Clock,
  Info,
} from "lucide-react";

interface PatientFormProps {
  patientId?: number;
}

export default function PatientForm({ patientId }: PatientFormProps) {
  const router = useRouter();
  const { alert, showAlert, hideAlert } = useAlert();
  const [form, setForm] = useState<Partial<Patient>>({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    gender: "male",
    address: "",
    emergency_contact: "",
    medical_history: "",
    allergies: "",
    current_medications: "",
    insurance_provider: "",
    insurance_number: "",
    has_diabetes: false,
    additional_notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    setLoading(true);
    getPatient(patientId)
      .then((data) => setForm(data))
      .catch((err) => {
        console.error("Erro ao carregar paciente:", err);
        showAlert("error", "Erro ao carregar dados do paciente.");
      })
      .finally(() => setLoading(false));
  }, [patientId, showAlert]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const name = target.name;

    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (patientId) {
        await updatePatient(patientId, form);
        showAlert("success", "Paciente atualizado com sucesso!");
      } else {
        await createPatient(form);
        showAlert("success", "Paciente criado com sucesso!");
      }

      // Redireciona após um breve delay para mostrar o alerta
      setTimeout(() => {
        router.push("/patients");
      }, 1500);
    } catch (err: any) {
      console.error("Erro ao salvar paciente:", err);
      showAlert("error", err.message || "Erro ao salvar paciente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do paciente...</p>
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
                <User size={32} className="mr-3 text-blue-600" />
                {patientId ? "Editar Paciente" : "Novo Paciente"}
              </h1>
              <p className="text-gray-600 mt-1">
                {patientId
                  ? "Atualize as informações do paciente"
                  : "Cadastre um novo paciente no sistema"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Básicas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User size={20} className="mr-2 text-blue-600" />
                    Informações Básicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name || ""}
                        onChange={handleChange}
                        required
                        placeholder="Nome completo do paciente"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Mail size={16} className="mr-2 text-blue-600" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email || ""}
                        onChange={handleChange}
                        required
                        placeholder="email@exemplo.com"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Phone size={16} className="mr-2 text-blue-600" />
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={form.phone || ""}
                        onChange={handleChange}
                        placeholder="(11) 99999-9999"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar size={16} className="mr-2 text-blue-600" />
                        Data de Nascimento *
                      </label>
                      <input
                        type="date"
                        name="birth_date"
                        value={form.birth_date || ""}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gênero
                      </label>
                      <select
                        name="gender"
                        value={form.gender || "male"}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="other">Outro</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <input
                        type="checkbox"
                        name="has_diabetes"
                        checked={form.has_diabetes || false}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Stethoscope size={16} className="mr-2 text-blue-600" />
                        Paciente com diabetes
                      </label>
                    </div>
                  </div>
                </div>

                {/* Contato e Endereço */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin size={20} className="mr-2 text-green-600" />
                    Contato e Endereço
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço Completo
                      </label>
                      <textarea
                        name="address"
                        value={form.address || ""}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Rua, número, bairro, cidade, estado"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contato de Emergência
                      </label>
                      <input
                        type="text"
                        name="emergency_contact"
                        value={form.emergency_contact || ""}
                        onChange={handleChange}
                        placeholder="Nome e telefone do contato"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Informações Médicas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Heart size={20} className="mr-2 text-red-600" />
                    Informações Médicas
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Histórico Médico
                      </label>
                      <textarea
                        name="medical_history"
                        value={form.medical_history || ""}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Doenças pré-existentes, cirurgias, condições crônicas..."
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <AlertTriangle
                          size={16}
                          className="mr-2 text-amber-600"
                        />
                        Alergias
                      </label>
                      <textarea
                        name="allergies"
                        value={form.allergies || ""}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Alergias a medicamentos, alimentos, etc."
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Pill size={16} className="mr-2 text-purple-600" />
                        Medicamentos em Uso
                      </label>
                      <textarea
                        name="current_medications"
                        value={form.current_medications || ""}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Medicamentos de uso contínuo"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Convênio e Observações */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield size={20} className="mr-2 text-blue-600" />
                    Convênio e Observações
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Convênio
                      </label>
                      <input
                        type="text"
                        name="insurance_provider"
                        value={form.insurance_provider || ""}
                        onChange={handleChange}
                        placeholder="Nome do convênio"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do Convênio
                      </label>
                      <input
                        type="text"
                        name="insurance_number"
                        value={form.insurance_number || ""}
                        onChange={handleChange}
                        placeholder="Número da carteirinha"
                        className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações Adicionais
                    </label>
                    <textarea
                      name="additional_notes"
                      value={form.additional_notes || ""}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Outras informações relevantes..."
                      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
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
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={20} className="mr-2" />
                        {patientId
                          ? "Atualizar Paciente"
                          : "Cadastrar Paciente"}
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
                <li>• Verifique os dados de contato</li>
                <li>• Informações médicas ajudam no diagnóstico</li>
                <li>• Dados de convênio para agilizar procedimentos</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-semibold text-amber-900 mb-2">
                Sobre o Diabetes
              </h3>
              <p className="text-amber-800 text-sm">
                Marque "Paciente com diabetes" se o paciente possui diagnóstico
                de diabetes. Isso ajudará no acompanhamento específico para
                retinopatia diabética.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-semibold text-green-900 mb-2">
                Dicas de Preenchimento
              </h3>
              <ul className="text-green-800 text-sm space-y-2">
                <li>• Use o nome completo do paciente</li>
                <li>• Inclua DDD no telefone</li>
                <li>• Seja específico nas alergias</li>
                <li>• Liste todos os medicamentos em uso</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
