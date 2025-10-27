import { useState } from "react";
import { api } from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUser,
  faLock,
  faStethoscope,
  faHospital,
} from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("🔐 [LOGIN] Iniciando processo de login...");
      console.log("📧 [LOGIN] Email:", email);

      const res = await api.post("/auth/login", { email, password });
      console.log("✅ [LOGIN] Resposta da API recebida:", res.data);

      // Log detalhado dos dados recebidos
      console.log("🔑 [LOGIN] Access Token:", res.data.access_token);
      console.log("👤 [LOGIN] Dados do usuário:", res.data.user);
      console.log("🎭 [LOGIN] Role do usuário:", res.data.user?.role);

      // Armazenar no localStorage com logs
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Verificar se foi salvo corretamente
      const savedToken = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");
      const savedUser = localStorage.getItem("user");

      console.log("💾 [LOGIN] Verificando localStorage:");
      console.log("   - Token salvo:", savedToken ? "✅ Sim" : "❌ Não");
      console.log("   - Role salvo:", savedRole ? "✅ Sim" : "❌ Não");
      console.log("   - User salvo:", savedUser ? "✅ Sim" : "❌ Não");

      if (savedToken) {
        console.log("🔍 [LOGIN] Token length:", savedToken.length);
        console.log(
          "🔍 [LOGIN] Token preview:",
          savedToken.substring(0, 20) + "..."
        );
      }

      console.log("🔄 [LOGIN] Redirecionando para /patients...");
      window.location.href = "/patients";
    } catch (err: any) {
      console.error("❌ [LOGIN] Erro no login:", err);

      // Log detalhado do erro
      if (err.response) {
        console.error("📡 [LOGIN] Resposta do servidor:", err.response.data);
        console.error("📡 [LOGIN] Status do erro:", err.response.status);
        setError(
          `Erro ${err.response.status}: ${
            err.response.data?.message || "Credenciais inválidas"
          }`
        );
      } else if (err.request) {
        console.error("🌐 [LOGIN] Erro de rede - sem resposta do servidor");
        setError("Erro de conexão. Verifique sua internet.");
      } else {
        console.error("⚡ [LOGIN] Erro inesperado:", err.message);
        setError("Erro inesperado. Tente novamente.");
      }
    } finally {
      console.log("🏁 [LOGIN] Processo de login finalizado");
      setIsLoading(false);
    }
  };

  // Log inicial do estado do localStorage
  console.log("🔍 [APP] Estado inicial do localStorage:");
  console.log(
    "   - Token:",
    localStorage.getItem("token") ? "Presente" : "Ausente"
  );
  console.log(
    "   - Role:",
    localStorage.getItem("role") ? "Presente" : "Ausente"
  );
  console.log(
    "   - User:",
    localStorage.getItem("user") ? "Presente" : "Ausente"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header com Gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faStethoscope}
                  className="text-white text-2xl"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Clinic Medical
            </h1>
            <p className="text-blue-100 text-sm">Sistema de Gestão Médica</p>
          </div>

          {/* Formulário */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="seu@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Sua senha"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-cyan-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Entrando...
                  </>
                ) : (
                  "Entrar no Sistema"
                )}
              </button>
            </form>

            {/* Informações adicionais */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center text-gray-500 mb-2">
                  <FontAwesomeIcon icon={faHospital} className="mr-2 text-sm" />
                  <span className="text-xs">
                    Sistema seguro e criptografado
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Entre em contato com o administrador em caso de problemas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            &copy; 2024 Clinic Medical. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
