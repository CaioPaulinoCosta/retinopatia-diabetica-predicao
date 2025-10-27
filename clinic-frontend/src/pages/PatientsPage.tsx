import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { usePatients } from "../hooks/usePatients";
import PatientList from "../components/patients/PatientList";
import PatientForm from "../components/patients/PatientForm";
import type { Patient } from "../types";
import toast from "react-hot-toast";
import { api } from "../services/api";

export default function PatientsPage() {
  const {
    patients,
    isLoading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    isCreating,
    isUpdating,
    isDeleting,
  } = usePatients();

  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "API_URL_NÃO_CONFIGURADA";

  // Criar paciente
  const handleCreate = async (data: Omit<Patient, "id">) => {
    await toast.promise(
      createPatient(data),
      {
        loading: "Cadastrando paciente...",
        success: "Paciente cadastrado com sucesso.",
        error: "Não foi possível cadastrar o paciente. Tente novamente.",
      },
      { success: { duration: 2500 }, error: { duration: 4000 } }
    );
    setShowForm(false);
  };

  // Editar paciente
  const handleEdit = async (data: Omit<Patient, "id">) => {
    if (!editingPatient?.id) return;
    await toast.promise(updatePatient({ id: editingPatient.id, data }), {
      loading: "Atualizando paciente...",
      success: "Paciente atualizado com sucesso.",
      error: "Não foi possível atualizar o paciente.",
    });
    setEditingPatient(null);
  };

  // Excluir paciente
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este paciente?")) return;
    await toast.promise(deletePatient(id), {
      loading: "Excluindo paciente...",
      success: "Paciente excluído com sucesso.",
      error: "Erro ao excluir paciente.",
    });
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => (window.location.href = "/login"));
  }, []);

  if (!user) return <p>Carregando...</p>;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-500 text-6xl mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro ao carregar pacientes
          </h2>
          <p className="text-gray-600 mb-4">
            Não foi possível conectar com o servidor. Tente novamente mais
            tarde.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <p className="text-sm text-gray-700 break-all">
              <strong>Endpoint:</strong> {apiBaseUrl}/api/patients
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Detalhe:</strong>{" "}
              {(error as Error)?.message || "Erro desconhecido"}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  // Formulário de criação
  if (showForm) {
    return (
      <div className="p-6">
        <PatientForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          isLoading={isCreating}
        />
      </div>
    );
  }

  // Formulário de edição
  if (editingPatient) {
    return (
      <div className="p-6">
        <PatientForm
          patient={editingPatient}
          onSubmit={handleEdit}
          onCancel={() => setEditingPatient(null)}
          isLoading={isUpdating}
        />
      </div>
    );
  }

  // Página principal
  return (
    <div className="p-6">
      <PatientList
        patients={patients}
        onEdit={setEditingPatient}
        onDelete={handleDelete}
        onCreate={() => setShowForm(true)}
        isLoading={isCreating || isDeleting}
      />
    </div>
  );
}
