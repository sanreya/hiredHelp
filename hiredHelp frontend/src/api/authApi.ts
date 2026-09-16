import { api, USE_MOCK_DATA } from "../config/api";
import { AuthResponse } from "../types";

export const authApi = {
  login: async (credentials: any): Promise<AuthResponse> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: "mock-jwt-token",
            userId: 15,
            role: credentials.email.includes("tech") ? "TECHNICIAN" : "USER"
          });
        }, 1000);
      });
    }
    const response = await api.post("/api/auth/signin", credentials);
    return response.data;
  },

  register: async (userData: any): Promise<{ message: string }> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: "User registered successfully" });
        }, 1000);
      });
    }
    const response = await api.post("/api/auth/signup", userData);
    return response.data;
  }
};
