"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { routes } from "@/config/routes";
import api from "@/lib/api";

interface DecodedToken {
  id: number;
  name: string;
  email: string;
  role: string;
  exp: number;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        router.push(routes.home);
        return;
      }

      setIsAuthenticated(true);

      // Busca dados do usuário no backend
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
          router.push(routes.home);
        });
    } catch (err) {
      console.error("[useAuth] Erro ao decodificar token:", err);
      console.error("Erro ao decodificar token:", err);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      router.push(routes.home);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    router.push(routes.home);
  }

  return { api, user, isAuthenticated, isLoading, logout }; // <-- retorna sua instância já configurada
}
