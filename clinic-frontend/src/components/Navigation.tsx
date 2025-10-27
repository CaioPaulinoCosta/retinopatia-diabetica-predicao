import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope,
  faDashboard,
  faUserInjured,
  faMicroscope,
  faSignOutAlt,
  faUserCircle,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { api } from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    console.log("🔍 [NAVIGATION] Iniciando verificação de autenticação");
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔐 [NAVIGATION] Token no localStorage:", token);

      if (!token) {
        console.log("❌ [NAVIGATION] Nenhum token encontrado");
        setIsLoading(false);
        return; // Não redireciona automaticamente, apenas não mostra user
      }

      console.log("🔐 [NAVIGATION] Verificando token com API...");
      const response = await api.get("/auth/me");
      console.log("✅ [NAVIGATION] Usuário autenticado:", response.data);
      setUser(response.data);
    } catch (error: any) {
      console.error("❌ [NAVIGATION] Erro na verificação:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 401) {
        console.log("🔐 [NAVIGATION] Token inválido, limpando...");
        localStorage.clear();
      }
      // Não redireciona para não quebrar a navegação
    } finally {
      console.log("🏁 [NAVIGATION] Verificação finalizada");
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🚪 [NAVIGATION] Fazendo logout...");
      await api.post("/auth/logout");
    } catch (error) {
      console.error("❌ [NAVIGATION] Erro no logout:", error);
    } finally {
      localStorage.clear();
      console.log("🔄 [NAVIGATION] Redirecionando para login");
      window.location.href = "/login";
    }
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: faDashboard },
    { path: "/patients", label: "Pacientes", icon: faUserInjured },
    { path: "/exams", label: "Exames", icon: faMicroscope },
  ];

  // Se ainda está carregando, mostra navigation básica
  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faStethoscope}
                  className="text-white text-sm"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ClinicVision
              </span>
            </div>
            <div className="text-sm text-gray-500">Verificando...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faStethoscope}
                className="text-white text-sm"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ClinicVision
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu - Só mostra se user estiver logado */}
          {user ? (
            <div className="flex items-center gap-4">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {user.role === "admin" ? "Administrador" : "Usuário"}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="w-6 h-6 text-gray-600"
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className="w-4 h-4"
                      />
                      Sair do Sistema
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Fazer Login
            </Link>
          )}
        </div>
      </div>

      {/* Overlay para fechar dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
}
