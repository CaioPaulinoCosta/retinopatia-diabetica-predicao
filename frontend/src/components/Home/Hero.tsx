"use client";

import { Reveal } from "../Animations/Reveal";
import { FontAwesomeIcon, icons } from "@/lib/icons";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { routes } from "@/config/routes";

export function Hero() {
  const { goTo } = useAppNavigation();
  return (
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
      <Reveal>
        <div className="text-center">
          <FontAwesomeIcon
            icon={icons.eye}
            className="text-sky-500 text-4xl md:text-5xl mb-5"
          />
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-slate-900">
            Sistema de <span className="text-sky-500">Predição Automática</span>
          </h1>

          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Plataforma completa para clínicas oftalmológicas: cadastro de
            pacientes, upload de imagens de retina e análise automatizada com
            Inteligência Artificial. Resultados em segundos, com relatórios
            profissionais em PDF.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => goTo(routes.login)}
              className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-sky-600 transition"
            >
              Começar agora
            </button>
            <a
              href="#sobre"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-700 shadow hover:shadow-md transition ring-1 ring-slate-200"
            >
              Entender o projeto
            </a>
          </div>
        </div>
      </Reveal>

      {/* IMAGEM DO HERO */}
      <Reveal delay={150}>
        <div className="mt-12 relative mx-auto max-w-5xl">
          <div className="w-full h-80 bg-slate-200 rounded-2xl shadow-2xl ring-1 ring-slate-200 flex items-center justify-center text-slate-500 italic">
            [ Espaço reservado para imagem do dashboard da clínica ]
          </div>
        </div>
      </Reveal>
    </section>
  );
}
