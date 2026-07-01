import { api } from "./client";

export interface AuthUser {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  avatar?: string;
  role: "admin" | "manager" | "customer" | "client";
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user: AuthUser;
  token?: string;
}

export const login = (email: string, password: string, rememberMe?: boolean) =>
  api.post<AuthResponse>("/auth/login", { email, password, rememberMe });

export const register = (data: {
  prenom: string;
  nom: string;
  email: string;
  password: string;
  telephone?: string;
}) => api.post<AuthResponse>("/auth/register", data);

export const logout = () => api.post<{ success: boolean }>("/auth/logout");

export const getMe = () =>
  api.get<{ success: boolean; user: AuthUser | null }>('/auth/me');
export const forgotPassword = (email: string) =>
  api.post<{ success: boolean; message: string }>("/auth/forgot-password", { email });

export const resetPassword = (token: string, password: string) =>
  api.put<{ success: boolean; message: string }>(`/auth/reset-password/${token}`, { password });
export const isStaff = (user: AuthUser | null) =>
  user?.role === "admin" || user?.role === "manager";
