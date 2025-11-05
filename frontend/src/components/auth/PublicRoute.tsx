"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/config/routes";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = [routes.home, routes.login, routes.register];

    if (!publicPaths.includes(pathname)) {
      return;
    }

    if (isAuthenticated) {
      router.replace(routes.dashboard);
    }
  }, [isAuthenticated, pathname, router]);

  if (
    isAuthenticated &&
    [routes.home, routes.login, routes.register].includes(pathname)
  ) {
    return null;
  }

  return <>{children}</>;
}
