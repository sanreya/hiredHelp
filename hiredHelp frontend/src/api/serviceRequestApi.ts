import { api, USE_MOCK_DATA } from "../config/api";
import { ServiceRequest, TechnicianSearchItem } from "../types";
import { mockUserRequests, mockTechnicians } from "../utils/mockData";

export const serviceRequestApi = {
  create: async (data: any): Promise<ServiceRequest> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({
        ...data,
        requestId: Math.floor(Math.random() * 1000) + 100,
        customerId: 15,
        status: "OPEN"
      }), 1000));
    }
    const response = await api.post("/service-requests", data);
    return response.data;
  },

  getMyRequests: async (): Promise<ServiceRequest[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve(mockUserRequests), 800));
    }
    const response = await api.get("/service-requests/my");
    return response.data;
  },

  getById: async (serviceId: number): Promise<ServiceRequest> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve(mockUserRequests[0]), 500));
    }
    const response = await api.get(`/service-requests?serviceId=${serviceId}`);
    return response.data;
  },

  cancel: async (serviceId: number): Promise<{ requestId: number; status: string; message: string }> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({
        requestId: serviceId,
        status: "CANCELLED",
        message: "Service request cancelled successfully"
      }), 800));
    }
    const response = await api.put(`/service-requests/cancel/${serviceId}`);
    return response.data;
  },

  getTechnicians: async (skillId: number): Promise<TechnicianSearchItem[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve(mockTechnicians), 800));
    }
    const response = await api.get(`/service-requests/technicians?skillId=${skillId}`);
    return response.data;
  },

  requestTechnician: async (requestId: number, technicianId: number): Promise<any> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({
        assignmentId: 501,
        requestId,
        technicianId,
        status: "REQUESTED",
        requestedAt: new Date().toISOString()
      }), 800));
    }
    const response = await api.post(`/service-request-assignment/${requestId}/technicians/${technicianId}/request`, {});
    return response.data;
  }
};
