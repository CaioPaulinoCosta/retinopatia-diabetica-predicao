import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para ADICIONAR TOKEN automaticamente
api.interceptors.request.use(
  (config) => {
    console.log("🔐 [API REQUEST] Configurando requisição para:", config.url);

    const token = localStorage.getItem("token");
    console.log(
      "🔐 [API REQUEST] Token no localStorage:",
      token ? "✅ Presente" : "❌ Ausente"
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 [API REQUEST] Token adicionado aos headers");
    } else {
      console.log(
        "🔐 [API REQUEST] Nenhum token encontrado, requisição sem autenticação"
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ [API REQUEST] Erro no interceptor de request:", error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log(
      "✅ [API RESPONSE] Resposta recebida:",
      response.status,
      response.config.url
    );
    return response;
  },
  (error) => {
    console.error("❌ [API RESPONSE] Erro na resposta:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers,
    });

    if (error.response?.status === 401) {
      console.log("🔐 [API RESPONSE] Token inválido ou expirado (401)");
      localStorage.clear();
      window.location.href = "/login";
    }

    if (error.response?.status === 404) {
      console.log(
        "🔍 [API RESPONSE] Endpoint não encontrado (404):",
        error.config?.url
      );
    }

    return Promise.reject(error);
  }
);
