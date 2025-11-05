"use client";

import PrivateRoute from "@/components/auth/PrivateRoute";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/config/routes";
import { logoutUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  async function handleLogout() {
    try {
      await logoutUser();
      router.push(routes.home);
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  }

  return (
    <PrivateRoute>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-slate-600 text-lg">Carregando dashboard...</p>
        </div>
      ) : (
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {user?.name} 👋
          </h1>
          <p className="text-slate-500">Função: {user?.role}</p>
          <button onClick={handleLogout}>Sair</button>
        </main>
      )}
    </PrivateRoute>
  );
}
