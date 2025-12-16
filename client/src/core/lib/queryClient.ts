import { QueryClient } from "@tanstack/react-query";

// Configuration centrale de l'URL de base de l'API Dry
// Ces variables peuvent être surchargées via les variables d'environnement Vite
// (VITE_API_BASE_URL et VITE_API_PREFIX) pour pointer vers une autre instance.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

// Préfixe d'application côté DryAPI (cf. DryAPI/api.config.js)
export const API_PREFIX =
  import.meta.env.VITE_API_PREFIX ?? "/api/spiritemeraude";

// Construit une URL complète vers l'API à partir d'un chemin relatif
// au préfixe applicatif (ex: "/product", "/atelier").
export function buildApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${API_PREFIX}${normalized}`;
}

// Appel HTTP brut réutilisable par la couche d'API typée.
// - Ajoute automatiquement la base et le préfixe
// - Sérialise le body JSON si besoin
// - Lève une erreur JS si le status HTTP n'est pas 2xx
export async function apiRequest(
  method: string,
  path: string,
  data?: unknown,
): Promise<Response> {
  const url = buildApiUrl(path);

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
}

// Client React Query partagé par toutes les features.
// Chaque feature fournit son propre queryFn typé (voir core/api/api.ts).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
