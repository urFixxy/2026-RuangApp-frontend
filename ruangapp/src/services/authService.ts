import api from "../api/axios";

interface LoginRequest {
  username: string;
  password: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  isActive?: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};
