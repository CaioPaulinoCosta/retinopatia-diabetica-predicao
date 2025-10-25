import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";

/* ===================== Schema (Zod) ===================== */

const today = new Date();
today.setHours(0, 0, 0, 0);

const isValidISODate = (v?: string) => {
  if (!v) return false;
  const d = new Date(v + "T00:00:00");
  return !Number.isNaN(d.getTime());
};
const toDate = (v?: string) => (v ? new Date(v + "T00:00:00") : undefined);

export const patientSchema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .trim()
    .min(3, "Mínimo de 3 caracteres")
    .max(120),

  email: z
    .string({ required_error: "Email é obrigatório" })
    .trim()
    .email("Email inválido"),

  // ✅ telefones: se vier undefined, mostra "Telefone é obrigatório"
  phone: z
    .string({ required_error: "Telefone é obrigatório" })
    .trim()
    .min(1, "Telefone é obrigatório")
    .regex(/^\(\d{2}\)\s?(?:\d{5}|\d{4})-\d{4}$/, "Telefone inválido"),

  birth_date: z
    .string({ required_error: "Data de nascimento é obrigatória" })
    .min(1, "Data de nascimento é obrigatória")
    .refine((v) => isValidISODate(v), "Data inválida")
    .refine((v) => {
      const d = toDate(v);
      return !!d && d <= today;
    }, "A data não pode ser no futuro")
    .refine((v) => {
      const d = toDate(v);
      if (!d) return false;
      const age = new Date(Date.now() - d.getTime()).getUTCFullYear() - 1970;
      return age >= 12 && age <= 120;
    }, "Idade deve estar entre 12 e 120 anos"),

  // ✅ gênero: aceita string vazia mas obriga escolher valor válido
  gender: z
    .string({ required_error: "Gênero é obrigatório" })
    .min(1, "Gênero é obrigatório")
    .refine(
      (v) => ["male", "female", "other"].includes(v),
      "Selecione um gênero válido"
    ),

  has_diabetes: z.boolean().optional().default(false),

  address: z.string().max(300).optional(),
  emergency_contact: z.string().max(120).optional(),
  medical_history: z.string().max(1000).optional(),
  allergies: z.string().max(600).optional(),
  current_medications: z.string().max(600).optional(),
  insurance_provider: z.string().max(120).optional(),
  insurance_number: z.string().max(60).optional(),
  additional_notes: z.string().max(600).optional(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: Omit<Patient, "id">) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

/* ===================== Componente ===================== */

export default function PatientForm({
  patient,
  onSubmit,
  onCancel,
  isLoading,
}: PatientFormProps) {
  const isEditing = !!patient;

  const defaultValues: Partial<PatientFormData> = useMemo(() => {
    if (!patient) return {};
    return {
      ...patient,
      birth_date: patient.birth_date?.split("T")[0],
    };
  }, [patient]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
    control, // <-- NECESSÁRIO para o Controller
  } = useForm<PatientFormData>({
    defaultValues,
    resolver: zodResolver(patientSchema),
    mode: "onTouched",
  });

  const [showMedicalInfo, setShowMedicalInfo] = useState(false);

  useEffect(() => {
    if (
      patient &&
      (patient.medical_history ||
        patient.allergies ||
        patient.current_medications ||
        patient.insurance_provider ||
        patient.insurance_number ||
        patient.additional_notes)
    ) {
      setShowMedicalInfo(true);
    }
  }, [patient]);

  useEffect(() => {
    const firstKey = Object.keys(errors)[0] as
      | keyof PatientFormData
      | undefined;
    if (firstKey) setFocus(firstKey as any);
  }, [errors, setFocus]);

  const submitting = isLoading || isSubmitting;

  // ✅ Tipagem oficial do RHF
  const onSubmitForm: SubmitHandler<PatientFormData> = async (data) => {
    await onSubmit(data as Omit<Patient, "id">);
  };

  const maxDate = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="space-y-8"
        noValidate
      >
        {/* Informações Pessoais */}
        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} className="text-blue-600" />
            Informações Pessoais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome Completo *
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Digite o nome completo"
                {...register("name")}
                aria-invalid={!!errors.name}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email *
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@exemplo.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Telefone (com máscara) */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Telefone *
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Telefone é obrigatório" }}
                  render={({ field, fieldState }) => (
                    <IMaskInput
                      id="phone"
                      mask="(00) 00000-0000" // celular BR
                      value={field.value ?? ""}
                      onAccept={(value: string) => field.onChange(value)}
                      inputRef={field.ref}
                      required={false}
                      inputMode="tel"
                      placeholder="(11) 99999-9999"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-invalid={!!fieldState.error}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Data de nascimento */}
            <div>
              <label
                htmlFor="birth_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Data de Nascimento *
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="birth_date"
                  type="date"
                  max={maxDate}
                  {...register("birth_date")}
                  aria-invalid={!!errors.birth_date}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.birth_date && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.birth_date.message}
                </p>
              )}
            </div>

            {/* Gênero */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gênero *
              </label>
              <select
                id="gender"
                {...register("gender")}
                aria-invalid={!!errors.gender}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione...</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.gender.message as string}
                </p>
              )}
            </div>

            {/* Diabetes */}
            <div className="flex items-center">
              <input
                id="has_diabetes"
                type="checkbox"
                {...register("has_diabetes")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="has_diabetes"
                className="ml-2 text-sm text-gray-700"
              >
                Paciente com diabetes
              </label>
            </div>
          </div>
        </section>

        {/* Endereço */}
        <section className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FontAwesomeIcon icon={faMapMarker} className="text-green-600" />
            Endereço
          </h2>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Endereço Completo
            </label>
            <textarea
              id="address"
              rows={3}
              autoComplete="street-address"
              {...register("address")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Rua, número, bairro, cidade, estado, CEP"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="emergency_contact"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contato de Emergência
            </label>
            <input
              id="emergency_contact"
              type="text"
              autoComplete="tel"
              {...register("emergency_contact")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nome e telefone do contato de emergência"
            />
          </div>
        </section>

        {/* Informações Médicas (Opcional) */}
        <section className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FontAwesomeIcon icon={faNotesMedical} className="text-red-600" />
              Informações Médicas
            </h2>
            <button
              type="button"
              onClick={() => setShowMedicalInfo((s) => !s)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {showMedicalInfo ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {showMedicalInfo && (
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="medical_history"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Histórico Médico
                </label>
                <textarea
                  id="medical_history"
                  rows={4}
                  {...register("medical_history")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doenças pré-existentes, cirurgias, condições crônicas..."
                />
              </div>

              <div>
                <label
                  htmlFor="allergies"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Alergias
                </label>
                <textarea
                  id="allergies"
                  rows={2}
                  {...register("allergies")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Alergias a medicamentos, alimentos, etc."
                />
              </div>

              <div>
                <label
                  htmlFor="current_medications"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Medicamentos em Uso
                </label>
                <textarea
                  id="current_medications"
                  rows={3}
                  {...register("current_medications")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Plano de saúde"
                  />
                  <input
                    type="text"
                    {...register("insurance_number")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Número da carteirinha"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="additional_notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Observações Adicionais
                </label>
                <textarea
                  id="additional_notes"
                  rows={2}
                  {...register("additional_notes")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Outras informações relevantes..."
                />
              </div>
            </div>
          )}
        </section>

        {/* Ações */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-colors"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
