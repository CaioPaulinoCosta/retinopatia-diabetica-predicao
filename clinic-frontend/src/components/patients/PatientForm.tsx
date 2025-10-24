import { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCalendar,
  faMapMarker,
  faNotesMedical,
} from "@fortawesome/free-solid-svg-icons";
import type { Patient } from "../../types";

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: Omit<Patient, "id">) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Tipo para o formulário, excluindo campos que não são usados no form
type PatientFormData = Omit<
  Patient,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;

export default function PatientForm({
  patient,
  onSubmit,
  onCancel,
  isLoading,
}: PatientFormProps) {
  const isEditing = !!patient;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    defaultValues: patient
      ? {
          ...patient,
          birth_date: patient.birth_date?.split("T")[0], // Format date for input
        }
      : {},
  });

  const [showMedicalInfo, setShowMedicalInfo] = useState(false);

  const onSubmitForm = async (data: PatientFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
        {/* Informações Pessoais */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} className="text-blue-600" />
            Informações Pessoais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                {...register("name", { required: "Nome é obrigatório" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Digite o nome completo"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email inválido",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="email@exemplo.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="tel"
                  {...register("phone", { required: "Telefone é obrigatório" })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento *
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  {...register("birth_date", {
                    required: "Data de nascimento é obrigatória",
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              {errors.birth_date && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.birth_date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gênero *
              </label>
              <select
                {...register("gender", { required: "Gênero é obrigatório" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("has_diabetes")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Paciente com diabetes
              </label>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FontAwesomeIcon icon={faMapMarker} className="text-green-600" />
            Endereço
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço Completo
            </label>
            <textarea
              rows={3}
              {...register("address")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Rua, número, bairro, cidade, estado, CEP"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contato de Emergência
            </label>
            <input
              type="text"
              {...register("emergency_contact")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Nome e telefone do contato de emergência"
            />
          </div>
        </div>

        {/* Informações Médicas (Opcional) */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FontAwesomeIcon icon={faNotesMedical} className="text-red-600" />
              Informações Médicas
            </h2>
            <button
              type="button"
              onClick={() => setShowMedicalInfo(!showMedicalInfo)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {showMedicalInfo ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {showMedicalInfo && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Histórico Médico
                </label>
                <textarea
                  rows={4}
                  {...register("medical_history")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Doenças pré-existentes, cirurgias, condições crônicas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alergias
                </label>
                <textarea
                  rows={2}
                  {...register("allergies")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Alergias a medicamentos, alimentos, etc..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicamentos em Uso
                </label>
                <textarea
                  rows={3}
                  {...register("current_medications")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Medicamentos de uso contínuo, dosagens..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Convênio
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    {...register("insurance_provider")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Plano de saúde"
                  />
                  <input
                    type="text"
                    {...register("insurance_number")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Número da carteirinha"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações Adicionais
                </label>
                <textarea
                  rows={2}
                  {...register("additional_notes")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Outras informações relevantes..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditing ? "Atualizando..." : "Cadastrando..."}
              </>
            ) : isEditing ? (
              "Atualizar Paciente"
            ) : (
              "Cadastrar Paciente"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
