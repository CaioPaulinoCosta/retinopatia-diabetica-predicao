import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faUserInjured,
  faMicroscope,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bem-vindo ao <span className="text-blue-600">ClinicVision</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema completo de gestão médica para diagnóstico e acompanhamento
            de pacientes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: faDashboard,
              title: "Dashboard",
              description: "Visão geral do sistema",
              path: "/dashboard",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: faUserInjured,
              title: "Pacientes",
              description: "Gerenciar cadastros",
              path: "/patients",
              color: "from-green-500 to-green-600",
            },
            {
              icon: faMicroscope,
              title: "Exames",
              description: "Upload e análise",
              path: "/exams",
              color: "from-purple-500 to-purple-600",
            },
            {
              icon: faChartLine,
              title: "Relatórios",
              description: "Estatísticas e métricas",
              path: "/reports",
              color: "from-orange-500 to-orange-600",
            },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="text-white text-2xl"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
