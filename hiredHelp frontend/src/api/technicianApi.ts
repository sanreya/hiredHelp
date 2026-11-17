import { api } from "../config/api";
import { TechnicianProfile, TechnicianSkill, PendingRequest, ActiveJob, CompletedJob, Review } from "../types";

export const technicianApi = {
  getProfile: async (): Promise<TechnicianProfile> => {
    const response = await api.get("/technicians/me");
    return response.data;
  },

  createProfile: async (data: any): Promise<TechnicianProfile> => {
    const response = await api.post("/technicians/profile", data);
    return response.data;
  },

  updateProfile: async (data: any): Promise<TechnicianProfile> => {
    const response = await api.put("/technicians/me", data);
    return response.data;
  },

  getSkills: async (): Promise<TechnicianSkill[]> => {
    const response = await api.get("/technicians/skills");
    return response.data;
  },

  addSkill: async (data: any): Promise<any> => {
    const response = await api.post("/technicians/skills", data);
    return response.data;
  },

  updateSkill: async (skillId: number, data: any): Promise<any> => {
    const response = await api.put(`/technicians/skills/${skillId}`, data);
    return response.data;
  },

  deleteSkill: async (skillId: number): Promise<any> => {
    const response = await api.delete(`/technicians/skills/${skillId}`);
    return response.data;
  },

  getPendingRequests: async (): Promise<PendingRequest[]> => {
    const response = await api.get("/technicians/requests/pending");
    return response.data;
  },

  getActiveJobs: async (): Promise<ActiveJob[]> => {
    const response = await api.get("/technicians/jobs/active");
    return response.data;
  },

  getCompletedJobs: async (): Promise<CompletedJob[]> => {
    const response = await api.get("/technicians/jobs/completed");
    return response.data;
  },

  getReviews: async (technicianId: number): Promise<Review[]> => {
    const response = await api.get(`/technicians/reviews`);
    return response.data;
  }
};
