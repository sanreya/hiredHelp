import { api, USE_MOCK_DATA } from "../config/api";
import { User, CompletedJobUser } from "../types";

export const userApi = {
  getMe: async (): Promise<User> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({
        userId: 15,
        firstName: "Sanjana",
        lastName: "N",
        email: "sanjana@gmail.com",
        phone: "9876543210",
        address: "Bangalore",
        latitude: 12.9716,
        longitude: 77.5946,
        role: "USER",
        active: true
      }), 500));
    }
    const response = await api.get("/users/me");
    return response.data;
  },

  updateMe: async (data: Partial<User>): Promise<User> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({
        userId: 15,
        firstName: data.firstName || "Sanjana",
        lastName: data.lastName || "N",
        email: "sanjana@gmail.com",
        phone: data.phone || "9876543210",
        address: data.address || "Bangalore",
        latitude: data.latitude || 12.9716,
        longitude: data.longitude || 77.5946,
        role: "USER",
        active: true
      }), 500));
    }
    const response = await api.put("/users/me", data);
    return response.data;
  },

  getCompletedJobs: async (): Promise<CompletedJobUser[]> => {
    const response = await api.get("/users/jobs/completed");
    return response.data;
  }
};
