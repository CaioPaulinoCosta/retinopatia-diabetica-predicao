"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export function useFetch<T>(url: string, options = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const response = await api.get(url, options);
        if (mounted) {
          setData(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Erro ao buscar dados");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false; // evita erro de atualização após unmount
    };
  }, [url]);

  return { data, loading, error };
}
