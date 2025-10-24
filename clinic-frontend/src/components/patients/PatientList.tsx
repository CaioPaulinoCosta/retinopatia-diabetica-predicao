import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faEdit,
  faTrash,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import type { Patient } from "../../types";

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
  isLoading?: boolean;
}

export default function PatientList({
  patients,
  onEdit,
  onDelete,
  onCreate,
  isLoading,
}: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Garante que patients seja sempre um array
  const safePatients = Array.isArray(patients) ? patients : [];

  const filteredPatients = safePatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("📋 DEBUG - PatientList rendering:", {
    inputPatients: patients,
    safePatients: safePatients,
    filteredPatients: filteredPatients.length,
    searchTerm,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-1">
            {safePatients.length} paciente(s) cadastrado(s)
          </p>
        </div>
        <button
          onClick={onCreate}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          {isLoading ? "Carregando..." : "Novo Paciente"}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-md">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar pacientes por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-white text-lg" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(patient)}
                  className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                  title="Editar paciente"
                >
                  <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => patient.id && onDelete(patient.id)}
                  className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                  title="Excluir paciente"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-gray-900 text-lg mb-2">
              {patient.name}
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
            </div>

            {patient.has_diabetes && (
              <div className="mt-4">
                <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  Diabetes
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon
            icon={faUser}
            className="text-gray-400 text-4xl mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm
              ? "Nenhum paciente encontrado"
              : "Nenhum paciente cadastrado"}
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Tente ajustar os termos da busca"
              : "Comece cadastrando o primeiro paciente"}
          </p>
        </div>
      )}
    </div>
  );
}
