"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PrivateRoute from "@/components/Auth/PrivateRoutes";
import { getPatient, updatePatient, Patient } from "@/services/patients";
import { formatDateForInput } from "@/utils/dateUtils";

export default function EditPatientPage() {
  const router = useRouter();
  const { id } = useParams();
  const [patient, setPatient] = useState<Partial<Patient>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatient() {
      // Verificação mais robusta do ID
      if (!id) {
        setError("ID do paciente não encontrado");
        setLoading(false);
        return;
      }

      const patientId = Array.isArray(id) ? Number(id[0]) : Number(id);

      if (isNaN(patientId)) {
        setError("ID do paciente inválido");
        setLoading(false);
        return;
      }

      try {
        console.log("Buscando paciente ID:", patientId);
        const data = await getPatient(patientId);
        console.log("Dados recebidos:", data);
        setPatient(data);
      } catch (err: any) {
        console.error("Erro detalhado:", err);
        setError("Erro ao carregar paciente.");
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, type, value } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setPatient((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updatePatient(Number(id), patient);
      router.push("/patients");
    } catch (err: any) {
      console.error(err);
      setError("Erro ao atualizar paciente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Carregando paciente...</p>
      </div>
    );

  return (
    <PrivateRoute>
      <>
        <Header />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">
              Editar Paciente
            </h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={patient.name || ""}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={patient.email || ""}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={patient.phone || ""}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formatDateForInput(patient.birth_date || "")}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Gênero */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gênero
                </label>
                <select
                  name="gender"
                  value={patient.gender || ""}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Selecione</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              {/* Endereço */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  value={patient.address || ""}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Contato de Emergência */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contato de Emergência
                </label>
                <input
                  type="text"
                  name="emergency_contact"
                  value={patient.emergency_contact || ""}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Histórico Médico */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Histórico Médico
                </label>
                <textarea
                  name="medical_history"
                  value={patient.medical_history || ""}
                  onChange={handleChange}
                  rows={2}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              {/* Alergias */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alergias
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={patient.allergies || ""}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Medicações Atuais */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Medicações Atuais
                </label>
                <input
                  type="text"
                  name="current_medications"
                  value={patient.current_medications || ""}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Convênio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Convênio
                </label>
                <input
                  type="text"
                  name="insurance_provider"
                  value={patient.insurance_provider || ""}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Número do Convênio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número do Convênio
                </label>
                <input
                  type="text"
                  name="insurance_number"
                  value={patient.insurance_number || ""}
                  onChange={handleChange}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Diabetes */}
              <div className="flex items-center gap-2 md:col-span-2 mt-2">
                <input
                  type="checkbox"
                  name="has_diabetes"
                  checked={patient.has_diabetes || false}
                  onChange={handleChange}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Possui Diabetes
                </label>
              </div>

              {/* Notas Adicionais */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notas Adicionais
                </label>
                <textarea
                  name="additional_notes"
                  value={patient.additional_notes || ""}
                  onChange={handleChange}
                  rows={2}
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              {/* Botões */}
              <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/patients")}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </>
    </PrivateRoute>
  );
}
