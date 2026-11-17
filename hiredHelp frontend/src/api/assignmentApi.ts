import { api} from "../config/api";

export const assignmentApi = {
  accept: async (assignmentId: number): Promise<any> => {
    const response = await api.put(`/service-request-assignment/${assignmentId}/accept`, {});
    return response.data;
  },

  reject: async (assignmentId: number, rejectionReason: string): Promise<any> => {
    const response = await api.put(`/service-request-assignment/${assignmentId}/reject`, { rejectionReason });
    return response.data;
  },

  arrive: async (requestId: number): Promise<any> => {
    const response = await api.put(`/service-request-assignment/${requestId}/arrive`, {});
    return response.data;
  },

  start: async (requestId: number): Promise<any> => {
    const response = await api.put(`/service-request-assignment/${requestId}/start`, {});
    return response.data;
  },

  complete: async (requestId: number, finalPrice: number): Promise<any> => {
    const response = await api.put(`/service-request-assignment/${requestId}/complete`, { finalPrice });
    return response.data;
  }

};
