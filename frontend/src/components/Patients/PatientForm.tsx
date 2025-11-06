"use client";

import { useState, FormEvent, useEffect } from "react";
import {
  Patient,
  createPatient,
  updatePatient,
  getPatient,
} from "@/services/patients";
import { useRouter } from "next/navigation";

interface PatientFormProps {
  patientId?: number;
}

export default function PatientForm({ patientId }: PatientFormProps) {
  const router = useRouter();
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    getPatient(patientId)
      .then((data) => setForm(data))
      .catch((err) => setError(err.message || "Erro ao carregar paciente."))
      .finally(() => setLoading(false));
  }, [patientId]);

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
    setLoading(true);
    setError(null);
    try {
      if (patientId) {
        await updatePatient(patientId, form);
      } else {
        await createPatient(form);
      }
      router.push("/patients");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar paciente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md space-y-4"
    >
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={form.email || ""}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="text"
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Nascimento
        </label>
        <input
          type="date"
          name="birth_date"
          value={form.birth_date || ""}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gênero
        </label>
        <select
          name="gender"
          value={form.gender || "male"}
          onChange={handleChange}
          className="mt-1 w-full border border-gray-300 rounded p-2"
        >
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
          <option value="other">Outro</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="has_diabetes"
          checked={form.has_diabetes || false}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label className="text-sm font-medium text-gray-700">
          Possui diabetes?
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Salvando..." : patientId ? "Atualizar" : "Criar"}
      </button>
    </form>
  );
}
