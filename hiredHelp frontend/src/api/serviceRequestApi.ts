import { api } from "../config/api";
import { ServiceRequest, TechnicianSearchItem } from "../types";

export const serviceRequestApi = {
  create: async (data: any): Promise<ServiceRequest> => {
    const response = await api.post("/service-requests", data);
    return response.data;
  },

  getMyRequests: async (): Promise<ServiceRequest[]> => {
    const response = await api.get("/service-requests/my");
    return response.data;
  },

  getById: async (serviceId: number): Promise<ServiceRequest> => {
    const response = await api.get(`/service-requests?serviceId=${serviceId}`);
    return response.data;
  },

  cancel: async (serviceId: number): Promise<{ requestId: number; status: string; message: string }> => {
    const response = await api.put(`/service-requests/cancel/${serviceId}`);
    return response.data;
  },

  getTechnicians: async (skillId: number): Promise<TechnicianSearchItem[]> => {
    const response = await api.get(`/service-requests/technicians?skillId=${skillId}`);
    return response.data;
  },

  requestTechnician: async (requestId: number, technicianId: number): Promise<any> => {
    const response = await api.post(`/service-request-assignment/${requestId}/technicians/${technicianId}/request`, {});
    return response.data;
  }
};
