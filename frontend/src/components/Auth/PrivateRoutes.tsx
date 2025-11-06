"use client";

import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/config/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // só tenta redirecionar depois que terminou de carregar o token
    if (!isLoading && !user) {
      const timeout = setTimeout(() => {
        router.push(routes.home);
      }, 500); // dá um tempinho para o hook terminar de processar
      return () => clearTimeout(timeout);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600 text-lg">Carregando...</p>
      </div>
    );
  }

  return <>{user ? children : null}</>;
}
