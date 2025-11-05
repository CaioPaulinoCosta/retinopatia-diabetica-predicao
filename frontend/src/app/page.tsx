"use client";

import { Hero } from "../components/Home/Hero";
import { About } from "../components/Home/About";
import { Features } from "../components/Home/Features";
import { Technologies } from "../components/Home/Technologies";
import { Footer } from "../components/Footer";
import PublicRoute from "@/components/auth/PublicRoute";

export default function Home() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        {/* HERO */}
        <Hero />
        {/* SOBE O PROJETO */}
        <About />
        {/* FUNCIONALIDADES */}
        <Features />
        {/* TECNOLOGIAS */}
        <Technologies />
        {/* RODAPÉ */}
        <Footer />
      </div>
    </PublicRoute>
  );
}
