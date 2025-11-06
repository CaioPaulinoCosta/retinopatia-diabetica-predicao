"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PatientForm from "@/components/Patients/PatientForm";
import PrivateRoute from "@/components/Auth/PrivateRoutes";

export default function NewPatientPage() {
  return (
    <PrivateRoute>
      <>
        <Header />
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
              Adicionar Paciente
            </h1>
            <PatientForm />
          </div>
        </main>
        <Footer />
      </>
    </PrivateRoute>
  );
}
