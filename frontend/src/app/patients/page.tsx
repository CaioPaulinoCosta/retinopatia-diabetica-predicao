"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPatients, Patient } from "@/services/patients";
import PrivateRoute from "@/components/Auth/PrivateRoutes";
import { useAuth } from "@/hooks/useAuth";
import { deletePatient } from "@/services/patients";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Filter,
  MoreVertical,
  Eye,
  X,
  AlertTriangle,
} from "lucide-react";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    async function fetchPatients() {
      try {
        const data = await getPatients();
        console.log("Pacientes recebidos:", data);
        setPatients(data);
        setFilteredPatients(data);
      } catch (err: any) {
        console.error(
          "Erro ao buscar pacientes:",
          err.response?.status,
          err.response?.data
        );
        setError(
          err.response?.data?.message ||
            err.message ||
            "Erro ao carregar pacientes."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, [user]);

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  async function handleDelete(id: number) {
    try {
      await deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setPatientToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      alert("Erro ao excluir o paciente.");
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Fechar modal quando clicar fora ou pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPatientToDelete(null);
      }
    };

    if (patientToDelete) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [patientToDelete]);

  const PatientCard = ({ patient }: { patient: Patient }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {patient.name}
              </h3>
              <p className="text-sm text-gray-500">ID: {patient.id}</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() =>
                setShowMenu(showMenu === patient.id ? null : patient.id)
              }
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical size={16} className="text-gray-400" />
            </button>

            {showMenu === patient.id && (
              <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[140px]">
                <Link
                  href={`/patients/${patient.id}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowMenu(null)}
                >
                  <Eye size={14} className="mr-2" />
                  Visualizar
                </Link>
                <Link
                  href={`/patients/${patient.id}/edit`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowMenu(null)}
                >
                  <Edit size={14} className="mr-2" />
                  Editar
                </Link>
                <button
                  onClick={() => {
                    setPatientToDelete(patient);
                    setShowMenu(null);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} className="mr-2" />
                  Excluir
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-4">
          {patient.email && (
            <div className="flex items-center text-gray-600">
              <Mail size={14} className="mr-2 text-blue-500" />
              <span className="text-sm truncate">{patient.email}</span>
            </div>
          )}
          {patient.phone && (
            <div className="flex items-center text-gray-600">
              <Phone size={14} className="mr-2 text-green-500" />
              <span className="text-sm">{patient.phone}</span>
            </div>
          )}
          {patient.birth_date && (
            <div className="flex items-center text-gray-600">
              <Calendar size={14} className="mr-2 text-purple-500" />
              <span className="text-sm">{formatDate(patient.birth_date)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link
            href={`/patients/${patient.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center transition-colors"
          >
            <Eye size={14} className="mr-1" />
            Ver detalhes
          </Link>
          <div className="flex space-x-2">
            <Link
              href={`/patients/${patient.id}/edit`}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit size={14} />
            </Link>
            <button
              onClick={() => setPatientToDelete(patient)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <PrivateRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Header />
          <main className="flex-1 p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />

        <main className="flex-1 p-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                  <Users size={32} className="mr-3 text-blue-600" />
                  Gerenciar Pacientes
                </h1>
                <p className="text-gray-600">
                  {patients.length} paciente(s) cadastrado(s)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Buscar pacientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 transition-all"
                  />
                </div>

                <Link
                  href="/patients/new"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} className="mr-2" />
                  Novo Paciente
                </Link>
              </div>
            </div>

            {/* Content */}
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <div className="text-red-600 font-semibold mb-2">
                  Erro ao carregar pacientes
                </div>
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-sm">
                  <User size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm
                      ? "Nenhum paciente encontrado"
                      : "Nenhum paciente cadastrado"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm
                      ? "Tente ajustar os termos da busca."
                      : "Comece cadastrando seu primeiro paciente."}
                  </p>
                  {!searchTerm && (
                    <Link
                      href="/patients/new"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center transition-colors"
                    >
                      <Plus size={20} className="mr-2" />
                      Cadastrar Primeiro Paciente
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-blue-600">
                      {patients.length}
                    </div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-green-600">
                      {patients.filter((p) => p.email).length}
                    </div>
                    <div className="text-sm text-gray-500">Com Email</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-purple-600">
                      {patients.filter((p) => p.phone).length}
                    </div>
                    <div className="text-sm text-gray-500">Com Telefone</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold text-orange-600">
                      {patients.filter((p) => p.birth_date).length}
                    </div>
                    <div className="text-sm text-gray-500">Com Data Nasc.</div>
                  </div>
                </div>

                {/* Patients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPatients.map((patient) => (
                    <PatientCard key={patient.id} patient={patient} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Delete Confirmation Modal - NOVO DESIGN */}
          {patientToDelete && (
            <>
              {/* Backdrop com blur sutil */}
              <div
                className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity duration-300"
                onClick={() => setPatientToDelete(null)}
              />

              {/* Modal no topo da tela */}
              <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md animate-in slide-in-from-top-8 duration-300">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mx-4">
                  {/* Header do Modal */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle size={20} className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Excluir Paciente
                        </h3>
                        <p className="text-sm text-gray-500">
                          Ação irreversível
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPatientToDelete(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Conteúdo do Modal */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-2">
                      Você está prestes a excluir o paciente:
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold text-sm">
                          {patientToDelete.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-red-900">
                            {patientToDelete.name}
                          </p>
                          <p className="text-sm text-red-600">
                            ID: {patientToDelete.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle
                          size={16}
                          className="text-amber-600 mt-0.5 flex-shrink-0"
                        />
                        <p className="text-sm text-amber-800">
                          <strong>Atenção:</strong> Todos os exames associados a
                          este paciente também serão permanentemente excluídos.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <button
                        onClick={() => setPatientToDelete(null)}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors flex-1 sm:flex-none text-center"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDelete(patientToDelete.id)}
                        className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors flex items-center justify-center flex-1 sm:flex-none"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Excluir Permanentemente
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <Footer />
      </div>
    </PrivateRoute>
  );
}
