// Types front pour l'authentification alignés avec DryAPI (modules/user)

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: "active" | "inactive" | "deleted" | "banned";
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  token: string;
  user: AuthUser;
}

export type AuthProfileResponse = AuthUser;
