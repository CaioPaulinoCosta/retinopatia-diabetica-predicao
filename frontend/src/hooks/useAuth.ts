"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { routes } from "@/config/routes";
import { getUser } from "@/services/authService";

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
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      } else {
        setUser(decoded);
        setIsAuthenticated(true);
        getUser()
          .then((data) => {
            setUser(data);
          })
          .catch((err) => {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUser(null);
          });
      }
    } catch (err) {
      console.error("[useAuth] Erro ao decodificar token:", err);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
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

  return { user, isAuthenticated, isLoading, logout };
}
