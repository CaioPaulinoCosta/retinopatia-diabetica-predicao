"use client";
import { FontAwesomeIcon, icons, brandsIcons } from "@/lib/icons";

export function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur border-t border-slate-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* LOGO / DESCRIÇÃO */}
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Lumin<span className="text-sky-600">Eye</span>
          </h3>
          <p className="text-slate-600 mt-1">
            Sistema de predição automática de retinopatia diabética.
          </p>
        </div>

        {/* LINKS DE NAVEGAÇÃO */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-slate-600 text-sm">
          <a
            href="https://github.com/CaioPaulinoCosta/retinopatia-diabetica-predicao"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-600 transition"
          >
            GitHub do projeto
          </a>
          <a href="#sobre" className="hover:text-sky-600 transition">
            Sobre o projeto
          </a>
        </div>

        {/* REDES SOCIAIS E CRÉDITO */}
        <div className="flex flex-col items-center md:items-end gap-3 text-slate-500 text-sm">
          <div className="flex gap-4 text-lg">
            <a
              href="https://github.com/CaioPaulinoCosta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-sky-600 transition"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={brandsIcons.github} />
            </a>
            <a
              href="https://www.linkedin.com/in/caio-paulino-costa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-sky-600 transition"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={brandsIcons.linkedin} />
            </a>
          </div>

          <p>
            Desenvolvido por{" "}
            <span className="font-medium text-slate-700 hover:text-sky-600 transition">
              Caio Paulino Costa
            </span>
          </p>

          <p>
            © {new Date().getFullYear()} LuminEye. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
