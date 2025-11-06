"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PrivateRoute from "@/components/Auth/PrivateRoutes";

export default function ExamsPage() {
  return (
    <PrivateRoute>
      <>
        <>
          <Header />
          <div className="flex-1">
            <h1>Página de Exames</h1>
          </div>
        </>
        <Footer />
      </>
    </PrivateRoute>
  );
}
