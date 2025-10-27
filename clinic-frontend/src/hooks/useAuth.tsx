// src/hooks/useAuth.js
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useAuth() {
  const token = localStorage.getItem("token");

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await api.get("/auth/me");
      return res.data;
    },
    enabled: !!token, // só executa se houver token
    staleTime: 1000 * 60 * 5, // cache por 5 minutos
  });

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };
}
