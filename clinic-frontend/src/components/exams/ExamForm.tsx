import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicroscope,
  faCalendar,
  faUser,
  faFileMedical,
  faUpload,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { usePatients } from "../../hooks/usePatients";
import type { Exam } from "../../types";

interface ExamFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface ExamFormData {
  patient_id: string;
  exam_type: string;
  exam_date: string;
  description?: string;
  notes?: string;
  status: "pending" | "completed" | "cancelled";
}

export default function ExamForm({
  onSubmit,
  onCancel,
  isLoading,
}: ExamFormProps) {
  const { patients = [], isLoading: isLoadingPatients } = usePatients();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ExamFormData>({
    defaultValues: {
      status: "pending",
      exam_date: new Date().toISOString().split("T")[0],
    },
  });

  const selectedPatientId = watch("patient_id");

  // Manipulador de seleção de imagem
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verifica se é uma imagem
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione um arquivo de imagem.");
        return;
      }

      // Verifica o tamanho do arquivo (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 10MB.");
        return;
      }

      setSelectedImage(file);

      // Cria preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove a imagem selecionada
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submissão do formulário
  const onSubmitForm = async (data: ExamFormData) => {
    console.log("📤 DEBUG - Submitting exam form data:", data);
    console.log("📤 DEBUG - Selected image name:", selectedImage?.name);
    console.log("📤 DEBUG - Selected image size:", selectedImage?.size);
    console.log("📤 DEBUG - Selected image type:", selectedImage?.type);

    const formData = new FormData();

    // CORREÇÃO: Usar os nomes corretos que a API espera
    formData.append("patient_id", data.patient_id.toString());
    formData.append("exam_type", data.exam_type.trim());
    formData.append("exam_date", data.exam_date);
    formData.append("status", data.status);

    if (data.description) {
      formData.append("description", data.description.trim());
    }
    if (data.notes) {
      formData.append("notes", data.notes.trim());
    }

    // Adiciona a imagem se existir
    if (selectedImage) {
      formData.append("image", selectedImage);
      console.log("📤 DEBUG - Image appended to FormData");
    }

    // DEBUG: Verificar conteúdo do FormData antes de enviar
    console.log("📤 DEBUG - FormData contents before sending:");
    for (let [key, value] of (formData as any).entries()) {
      console.log(`  ${key}:`, value, `(type: ${typeof value})`);
    }

    await onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
        {/* Informações Básicas */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FontAwesomeIcon icon={faMicroscope} className="text-blue-600" />
            Informações do Exame
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seleção de Paciente */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paciente *
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <select
                  {...register("patient_id", {
                    required: "Paciente é obrigatório",
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={isLoadingPatients}
                >
                  <option value="">Selecione um paciente...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </option>
                  ))}
                </select>
              </div>
              {errors.patient_id && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.patient_id.message}
                </p>
              )}
              {isLoadingPatients && (
                <p className="text-gray-500 text-sm mt-1">
                  Carregando pacientes...
                </p>
              )}
            </div>

            {/* Tipo de Exame */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Exame *
              </label>
              <input
                type="text"
                {...register("exam_type", {
                  required: "Tipo de exame é obrigatório",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ex: Retinografia, Fundoscopia, etc."
              />
              {errors.exam_type && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.exam_type.message}
                </p>
              )}
            </div>

            {/* Data do Exame */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data do Exame *
              </label>
              <div className="relative">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  {...register("exam_date", {
                    required: "Data do exame é obrigatória",
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              {errors.exam_date && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.exam_date.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                {...register("status", { required: "Status é obrigatório" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
              {errors.status && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Upload de Imagem */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FontAwesomeIcon icon={faImage} className="text-green-600" />
            Imagem do Exame
          </h2>

          <div className="space-y-6">
            {/* Área de Upload */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                imagePreview
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="max-w-md mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remover Imagem
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Alterar Imagem
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <FontAwesomeIcon
                    icon={faUpload}
                    className="text-gray-400 text-4xl mx-auto"
                  />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Clique para selecionar uma imagem
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      PNG, JPG, JPEG até 10MB
                    </p>
                  </div>
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Selecionar Imagem
                  </button>
                </div>
              )}
            </div>

            {/* Informações sobre o upload */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileMedical} />
                Informações Importantes
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• A imagem será analisada automaticamente pela IA</li>
                <li>• Formatos suportados: PNG, JPG, JPEG</li>
                <li>• Tamanho máximo: 10MB</li>
                <li>• Recomendado: imagens retina de boa qualidade</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Descrição e Notas */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <FontAwesomeIcon icon={faFileMedical} className="text-purple-600" />
            Observações
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                rows={3}
                {...register("description")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Descrição breve do exame..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionais
              </label>
              <textarea
                rows={4}
                {...register("notes")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Observações, sintomas, medicamentos em uso..."
              />
            </div>
          </div>
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
            disabled={isLoading || !selectedImage}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Cadastrando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faMicroscope} />
                Cadastrar Exame
              </>
            )}
          </button>
        </div>

        {/* Aviso se não há imagem */}
        {!selectedImage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ É necessário selecionar uma imagem para cadastrar o exame.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
