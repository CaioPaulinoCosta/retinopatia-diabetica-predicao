"use client";

import { Reveal } from "../Animations/Reveal";
import { FontAwesomeIcon, icons } from "@/lib/icons";

export function Features() {
  return (
    <section className="bg-white/70 backdrop-blur ring-1 ring-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <div className="h-80 rounded-2xl bg-slate-50 ring-1 ring-slate-200 shadow-inner flex items-center justify-center text-slate-500 italic">
            [ Espaço reservado para imagem do relatório PDF ]
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Resultados e diagnósticos
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              O modelo de IA classifica as imagens de retina em cinco níveis de
              severidade, atingindo acurácia superior a 96%. Cada exame
              analisado gera um relatório detalhado e armazenado no sistema.
            </p>

            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-800">
              <pre>
                {`DIAGNÓSTICO: COM RETINOPATIA DIABÉTICA
Probabilidades:
• Sem Retinopatia (No_DR): 0.0%
• Com Retinopatia (DR): 100.0%`}
              </pre>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
