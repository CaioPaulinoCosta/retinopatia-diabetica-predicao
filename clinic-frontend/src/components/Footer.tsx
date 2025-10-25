import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-white/70 backdrop-blur border-t border-slate-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* LOGO / DESCRIÇÃO */}
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Clinic<span className="text-blue-600">Vision</span>
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
            className="hover:text-blue-600 transition"
          >
            GitHub do projeto
          </a>
          <a href="#sobre" className="hover:text-blue-600 transition">
            Sobre o projeto
          </a>
          <a href="/dashboard" className="hover:text-blue-600 transition">
            Dashboard
          </a>
        </div>

        {/* REDES SOCIAIS E CRÉDITO */}
        <div className="flex flex-col items-center md:items-end gap-3 text-slate-500 text-sm">
          <div className="flex gap-4 text-lg">
            <a
              href="https://github.com/CaioPaulinoCosta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-blue-600 transition"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
              href="https://www.linkedin.com/in/caio-paulino-costa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-blue-600 transition"
              aria-label="LinkedIn"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>

          <p>
            Desenvolvido por{" "}
            <span className="font-medium text-slate-700 hover:text-blue-600 transition">
              Caio Paulino Costa
            </span>
          </p>

          <p>
            © {new Date().getFullYear()} ClinicVision. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
