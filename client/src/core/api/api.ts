import {
  API_BASE_URL,
  API_PREFIX,
  apiRequest,
} from "../lib/queryClient";
import type {
  ApiResponse,
  Product,
  ProductCategory,
  Formation,
  Impact,
  GalleryPhoto,
  GalleryCategory,
  InsertContactMessage,
} from "@shared/schema";
import type {
  AuthLoginResponse,
  AuthProfileResponse,
  LoginPayload,
  RegisterPayload,
} from "@/features/auth/AuthTypes";

// Chemins "fonctionnels" relatifs au préfixe d'application DryAPI
// On suit la même convention que dans DryAPI/api.config.js
const PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  PRODUCT: {
    LIST: "/product",
    DETAIL: (id: string) => `/product/${id}`,
  },
  FORMATION: {
    LIST: "/formation",
    DETAIL: (id: string) => `/formation/${id}`,
  },
  IMPACT: {
    LIST: "/impact",
  },
  GALLERY: {
    LIST: "/gallery",
  },
  CONTACT: {
    SEND: "/contact",
  },
} as const;

// ENDPOINTS "documentaires" : même structure que DryAPI/api.config.js
// mais sans dupliquer l'host (on garde uniquement base+prefix).
export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_PREFIX}${PATHS.AUTH.LOGIN}`,
    REGISTER: `${API_PREFIX}${PATHS.AUTH.REGISTER}`,
    PROFILE: `${API_PREFIX}${PATHS.AUTH.PROFILE}`,
  },
  PRODUCT: {
    LIST: `${API_PREFIX}${PATHS.PRODUCT.LIST}`,
    DETAIL: (id: string) => `${API_PREFIX}${PATHS.PRODUCT.DETAIL(id)}`,
  },
  FORMATION: {
    LIST: `${API_PREFIX}${PATHS.FORMATION.LIST}`,
    DETAIL: (id: string) => `${API_PREFIX}${PATHS.FORMATION.DETAIL(id)}`,
  },
  IMPACT: {
    LIST: `${API_PREFIX}${PATHS.IMPACT.LIST}`,
  },
  GALLERY: {
    LIST: `${API_PREFIX}${PATHS.GALLERY.LIST}`,
  },
  CONTACT: {
    SEND: `${API_PREFIX}${PATHS.CONTACT.SEND}`,
  },
} as const;

// Rôles & catégories exposés côté frontend, alignés avec DryAPI
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const CATEGORIES = {
  PRODUCT: [
    "sac",
    "trousse",
    "sandale",
    "accessoire",
    "personnalise",
    "saisonnier",
  ] as ProductCategory[],
  GALLERY: ["atelier", "creation", "humanitaire", "autre"] as GalleryCategory[],
} as const;

function mapId<T extends { [k: string]: any }>(item: T): T {
  if (item && typeof item === "object" && "_id" in item && !("id" in item)) {
    return { ...(item as any), id: (item as any)._id };
  }
  return item;
}

// Helpers génériques pour consommer le format ApiResponse<T> de DryAPI
async function getList<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T[]> {
  const search = params
    ? new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)]),
      ).toString()
    : "";

  const fullPath = search ? `${path}?${search}` : path;
  const res = await apiRequest("GET", fullPath);
  const json = (await res.json()) as ApiResponse<any[]>;
  return json.data.map(mapId) as T[];
}

async function getOne<T>(path: string): Promise<T> {
  const res = await apiRequest("GET", path);
  const json = (await res.json()) as ApiResponse<any>;
  return mapId(json.data) as T;
}

async function postJson<TBody, TData>(
  path: string,
  body: TBody,
): Promise<TData> {
  const res = await apiRequest("POST", path, body);
  const json = (await res.json()) as ApiResponse<any>;
  return mapId(json.data) as TData;
}

export const api = {
  auth: {
    login: (payload: LoginPayload): Promise<AuthLoginResponse> =>
      postJson<LoginPayload, AuthLoginResponse>(PATHS.AUTH.LOGIN, payload),
    register: (payload: RegisterPayload): Promise<AuthProfileResponse> =>
      postJson<RegisterPayload, AuthProfileResponse>(PATHS.AUTH.REGISTER, payload),
    profile: async (token: string): Promise<AuthProfileResponse> => {
      const url = `${API_BASE_URL}${API_PREFIX}${PATHS.AUTH.PROFILE}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
      }
      const json = (await res.json()) as ApiResponse<any>;
      return mapId(json.data) as AuthProfileResponse;
    },
  },

  product: {
    list: (options?: { category?: ProductCategory | "all" }) =>
      getList<Product>(PATHS.PRODUCT.LIST, {
        category:
          options?.category && options.category !== "all"
            ? options.category
            : undefined,
      }),
    detail: (id: string) => getOne<Product>(PATHS.PRODUCT.DETAIL(id)),
  },

  formation: {
    list: () => getList<Formation>(PATHS.FORMATION.LIST),
    detail: (id: string) => getOne<Formation>(PATHS.FORMATION.DETAIL(id)),
  },

  impact: {
    list: () => getList<Impact>(PATHS.IMPACT.LIST),
  },

  gallery: {
    list: (options?: { category?: GalleryCategory | "all" }) =>
      getList<GalleryPhoto>(PATHS.GALLERY.LIST, {
        category:
          options?.category && options.category !== "all" ? options.category : undefined,
      }),
  },

  contact: {
    send: (payload: InsertContactMessage) =>
      postJson<InsertContactMessage, unknown>(PATHS.CONTACT.SEND, payload),
  },
} as const;

export const API_ROOT = `${API_BASE_URL}${API_PREFIX}`;
