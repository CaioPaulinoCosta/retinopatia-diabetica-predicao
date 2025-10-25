import { Link } from "react-router-dom";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faUserInjured,
  faMicroscope,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

/** Reveal: anima elementos quando entram no viewport (sem libs externas) */
function Reveal({
  children,
  delay = 0,
}: PropsWithChildren<{ delay?: number }>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect(); // encerra ao ativar
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        transitionDelay: `${delay}ms`,
      }}
      className={`will-change-transform ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
              Projeto com IA • Retinopatia Diabética
            </span>

            <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-slate-900">
              Predição Automática de{" "}
              <span className="text-blue-700">Retinopatia Diabética</span>
            </h1>

            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Sistema web que simula o ambiente de uma clínica: cadastro de
              pacientes, envio de imagens de retina e análise automática com um
              modelo de <i>machine learning</i> treinado no Google Colab. O
              resultado aparece no sistema e pode ser exportado em PDF.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/patients"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"
              >
                Começar agora
              </Link>
              <a
                href="#sobre"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-700 shadow hover:shadow-md transition ring-1 ring-slate-200"
              >
                Entender o projeto
              </a>
            </div>
          </div>
        </Reveal>

        {/* IMAGEM/GIF DO HERO */}
        <Reveal delay={150}>
          <div className="mt-12 relative mx-auto max-w-5xl">
            <img
              src="/assets/images/image_1.png"
              alt="Visualização do dashboard principal"
              loading="lazy"
              className="w-full rounded-2xl shadow-2xl ring-1 ring-slate-200 object-cover"
            />
          </div>
        </Reveal>
      </section>

      {/* SOBRE O PROJETO */}
      <section id="sobre" className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <img
              src="/exemplo-imagem.png"
              alt="Demonstração do sistema"
              className="rounded-2xl shadow-xl ring-1 ring-slate-200 w-full object-cover"
            />
          </div>

          <div className="lg:w-1/2 text-left">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Sobre o projeto
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              O objetivo é demonstrar, de forma prática e acessível, como
              modelos de
              <i> deep learning </i> podem apoiar o diagnóstico de retinopatia
              diabética. A aplicação foi construída com <b>FastAPI</b>,{" "}
              <b>Laravel</b> e <b>React</b>, orquestrados em <b>Docker</b> e
              integrados ao <b>Cloudinary</b> para armazenamento otimizado de
              imagens. O sistema simula o ambiente clínico completo: cadastro de
              pacientes, upload de exames, análise automática e geração de
              relatórios em PDF.
            </p>
          </div>
        </div>
      </section>

      {/* DEMONSTRAÇÃO / RESULTADO */}
      <section className="bg-white/70 backdrop-blur ring-1 ring-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <div className="lg:col-span-6">
                {/* Imagem do relatório PDF ou tela de resultado */}
                <div className="h-80 rounded-2xl bg-slate-50 ring-1 ring-slate-200 shadow-inner flex items-center justify-center text-slate-500">
                  {/* 👉 Inserir print do relatório PDF gerado */}
                  Relatório PDF (print)
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="lg:col-span-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  Resultados do modelo
                </h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  Classificação em cinco categorias:
                  <b> No_DR</b> (sem retinopatia), <b>Mild</b>,<b> Moderate</b>,{" "}
                  <b>Severe</b> e <b>Proliferate_DR</b>. Métricas atuais de
                  treinamento: <b>Loss 0.1161</b> e <b>Accuracy 0.9618</b>. A
                  análise é registrada e exibida no sistema, mantendo o
                  histórico por paciente e exame.
                </p>

                <div className="mt-5 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <pre className="text-sm text-slate-800 overflow-x-auto">
                    {`DIAGNÓSTICO: COM RETINOPATIA DIABÉTICA
Probabilidades:
• Sem Retinopatia (No_DR): 0.0%
• Com Retinopatia (DR): 100.0%`}
                  </pre>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* STACK & DECISÕES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <h3 className="text-2xl font-bold text-slate-900">
            Stack e decisões de arquitetura
          </h3>
          <p className="mt-3 text-slate-700 leading-relaxed">
            A FastAPI mantém o modelo isolado do backend administrativo
            (Laravel), permitindo evolução independente do modelo e testes de
            desempenho sem afetar o restante do sistema. O React organiza a
            experiência do usuário com foco em clareza e rapidez. Docker garante
            ambientes reproduzíveis e simplifica a execução local.
          </p>
        </Reveal>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white shadow-lg">
            <h3 className="text-2xl font-bold">Explore o sistema agora</h3>
            <p className="mt-2 text-blue-50">
              Cadastre um paciente, envie um exame e gere o relatório completo.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/patients"
                className="rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 shadow hover:shadow-md transition"
              >
                Cadastrar Paciente
              </Link>
              <Link
                to="/exams"
                className="rounded-xl bg-white/10 px-5 py-3 font-semibold text-white ring-1 ring-white/30 hover:bg-white/20 transition"
              >
                Enviar Exame
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}
