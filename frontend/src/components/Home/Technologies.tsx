"use client";

import { Reveal } from "../Animations/Reveal";
import { FontAwesomeIcon, icons } from "@/lib/icons";

export function Technologies() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <Reveal>
        <h3 className="text-2xl font-bold text-slate-900 mb-4">
          Tecnologias e arquitetura
        </h3>
        <p className="text-slate-700 leading-relaxed mb-8">
          <FontAwesomeIcon
            icon={icons.microscope}
            className="text-sky-600 mr-2"
          />
          A <b>FastAPI</b> processa imagens e executa o modelo de machine
          learning, enquanto o <b>Laravel</b> gerencia pacientes e exames. O
          <b> React</b> oferece uma experiência fluida, e o <b>Docker</b>{" "}
          garante execução consistente entre ambientes.
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-slate-700">
            <FontAwesomeIcon
              icon={icons.userInjured}
              className="text-blue-600"
            />
            Cadastro de pacientes
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <FontAwesomeIcon icon={icons.chartLine} className="text-blue-600" />
            Dashboard clínico
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <FontAwesomeIcon icon={icons.eye} className="text-blue-600" />
            Análise de retina por IA
          </div>
        </div>
      </Reveal>
    </section>
  );
}
