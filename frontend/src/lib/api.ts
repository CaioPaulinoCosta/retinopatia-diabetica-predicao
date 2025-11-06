"use client";

import { routes } from "@/config/routes";
import axiox from "axios";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axiox.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(
      "Erro na requisição:",
      error.response?.status,
      error.response?.data
    );
    if (error.response?.status === 401) {
      // apenas remove o token e retorna um erro
      localStorage.removeItem("token");
      // opcional: mostrar toast
      toast.error("Sua sessão expirou. Faça login novamente.");
    }
    return Promise.reject(error);
  }
);

export default api;
