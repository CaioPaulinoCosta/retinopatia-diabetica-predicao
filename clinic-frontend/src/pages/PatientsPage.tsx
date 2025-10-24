import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { usePatients } from "../hooks/usePatients";
import PatientList from "../components/patients/PatientList";
import PatientForm from "../components/patients/PatientForm";
import type { Patient } from "../types";

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

  // DEBUG: Logs para troubleshooting
  console.log("🔍 DEBUG - PatientsPage state:", {
    patientsCount: patients?.length,
    isLoading,
    error: error?.message,
    showForm,
    editingPatient: editingPatient?.id,
  });

  // Funções de manipulação de dados
  const handleCreate = async (data: Omit<Patient, "id">) => {
    console.log("🆕 DEBUG - Creating patient:", data);
    try {
      await createPatient(data);
      setShowForm(false);
      console.log("✅ DEBUG - Patient created successfully");
    } catch (error) {
      console.error("❌ DEBUG - Error creating patient:", error);
      alert("Erro ao criar paciente. Verifique o console para detalhes.");
    }
  };

  const handleEdit = async (data: Omit<Patient, "id">) => {
    if (editingPatient?.id) {
      console.log("✏️ DEBUG - Updating patient:", editingPatient.id, data);
      try {
        await updatePatient({ id: editingPatient.id, data });
        setEditingPatient(null);
        console.log("✅ DEBUG - Patient updated successfully");
      } catch (error) {
        console.error("❌ DEBUG - Error updating patient:", error);
        alert("Erro ao atualizar paciente. Verifique o console para detalhes.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    console.log("🗑️ DEBUG - Attempting to delete patient:", id);
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
      try {
        await deletePatient(id);
        console.log("✅ DEBUG - Patient deleted successfully");
      } catch (error) {
        console.error("❌ DEBUG - Error deleting patient:", error);
        alert("Erro ao excluir paciente. Verifique o console para detalhes.");
      }
    }
  };

  // Estado de erro
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
            Não foi possível conectar com a API. Verifique se o servidor Laravel
            está rodando.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg text-left">
            <p className="text-sm text-gray-700">
              <strong>URL da API:</strong> http://localhost:8002/api/patients
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Erro:</strong>{" "}
              {(error as Error)?.message || "Erro desconhecido"}
            </p>
          </div>
          <div className="mt-4 flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Criar Paciente Offline
            </button>
          </div>
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
          <p className="text-sm text-gray-500 mt-2">
            Conectando com a API em: http://localhost:8002/api/patients
          </p>
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
          onCancel={() => {
            console.log("🚪 DEBUG - Cancel create form");
            setShowForm(false);
          }}
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
          onCancel={() => {
            console.log("🚪 DEBUG - Cancel edit form");
            setEditingPatient(null);
          }}
          isLoading={isUpdating}
        />
      </div>
    );
  }

  // Lista principal de pacientes
  return (
    <div className="p-6">
      {/* DEBUG BUTTONS - REMOVER EM PRODUÇÃO */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <button
          onClick={() => {
            console.log("🐛 DEBUG - Manually setting showForm to true");
            setShowForm(true);
          }}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm shadow-lg"
        >
          DEBUG: Show Form
        </button>
        <button
          onClick={() => {
            console.log("🐛 DEBUG - Testing API connection");
            fetch("http://localhost:8002/api/patients")
              .then((r) => r.json())
              .then((data) => console.log("🔌 DEBUG - API Response:", data))
              .catch((err) => console.error("🔌 DEBUG - API Error:", err));
          }}
          className="bg-purple-500 text-white px-3 py-1 rounded text-sm shadow-lg"
        >
          DEBUG: Test API
        </button>
      </div>

      <PatientList
        patients={patients}
        onEdit={(patient) => {
          console.log("✏️ DEBUG - Editing patient:", patient.id);
          setEditingPatient(patient);
        }}
        onDelete={handleDelete}
        onCreate={() => {
          console.log("🆕 DEBUG - Creating new patient");
          setShowForm(true);
        }}
        isLoading={isCreating || isDeleting}
      />
    </div>
  );
}
