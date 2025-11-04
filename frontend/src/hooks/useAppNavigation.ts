"use client";

import { useRouter } from "next/navigation";

export function useAppNavigation() {
  const router = useRouter();

  function goTo(path: string) {
    router.push(path);
  }

  return { goTo };
}
