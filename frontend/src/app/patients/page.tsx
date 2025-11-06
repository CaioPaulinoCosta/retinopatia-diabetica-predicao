"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getPatients, Patient } from "@/services/patients";
import PrivateRoute from "@/components/Auth/PrivateRoutes";
import { useAuth } from "@/hooks/useAuth";
import { deletePatient } from "@/services/patients";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  useEffect(() => {
    if (!user) return; // ⚠️ só busca pacientes quando user existe
    async function fetchPatients() {
      try {
        const data = await getPatients();
        console.log("Pacientes recebidos:", data);
        setPatients(data);
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

  async function handleDelete(id: number) {
    try {
      await deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setPatientToDelete(null);
      alert("Paciente excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      alert("Erro ao excluir o paciente.");
    }
  }

  if (loading) return <p>Carregando pacientes...</p>;
  if (error) return <p>{error}</p>;
  return (
    <PrivateRoute>
      <>
        <Header />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">
                Pacientes
              </h1>
              <Link
                href="/patients/new"
                className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
              >
                Adicionar Paciente
              </Link>
            </div>

            {loading ? (
              <p className="text-gray-500">Carregando pacientes...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : patients.length === 0 ? (
              <p className="text-gray-600">Nenhum paciente encontrado.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map((p) => (
                  <li
                    key={p.id}
                    className="bg-white shadow rounded p-4 hover:shadow-lg transition relative"
                  >
                    <Link href={`/patients/${p.id}`} className="block mb-3">
                      <h2 className="text-lg font-medium text-gray-800">
                        {p.name}
                      </h2>
                      <p className="text-gray-500 text-sm">{p.email}</p>
                    </Link>

                    <div className="flex justify-between items-center">
                      <Link
                        href={`/patients/${p.id}/edit`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => setPatientToDelete(p)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {patientToDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Confirmar exclusão
                </h3>
                <p className="text-gray-600 mb-6">
                  Tem certeza que deseja excluir o paciente{" "}
                  <span className="font-medium text-gray-800">
                    {patientToDelete.name}
                  </span>
                  ?
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setPatientToDelete(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(patientToDelete.id)}
                    className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </>
    </PrivateRoute>
  );
}
