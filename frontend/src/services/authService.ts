"use client";

import { api } from "@/lib/api";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
}) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  return response.data;
}

export async function getUser() {
  const response = await api.get("/auth/me");
  return response.data;
}
