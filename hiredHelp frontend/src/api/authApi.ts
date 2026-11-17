import {api} from "../config/api";
import { AuthResponse } from "../types";

export const authApi = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/signin", credentials);
    return response.data;
  },

  register: async (userData: any): Promise<{ message: string }> => {
    const response = await api.post("/api/auth/signup", userData);
    return response.data;
  }
};
