import { api } from "../config/api";
import { User, CompletedJobUser } from "../types";

export const userApi = {
  getMe: async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updateMe: async (data: Partial<User>): Promise<User> => {
    const response = await api.put("/users/me", data);
    return response.data;
  },

  getCompletedJobs: async (): Promise<CompletedJobUser[]> => {
    const response = await api.get("/users/jobs/completed");
    return response.data;
  }
};
