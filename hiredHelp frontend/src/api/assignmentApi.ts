import { api, USE_MOCK_DATA } from "../config/api";

export const assignmentApi = {
  accept: async (assignmentId: number): Promise<any> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({
        assignmentId,
        requestId: 101,
        technicianId: 25,
        status: "ACCEPTED",
        respondedAt: new Date().toISOString()
      }), 800));
    }
    const response = await api.put(`/service-request-assignment/${assignmentId}/accept`, {});
    return response.data;
  },

  reject: async (assignmentId: number, rejectionReason: string): Promise<any> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({
        assignmentId,
        requestId: 101,
        technicianId: 25,
        status: "REJECTED",
        rejectionReason,
        respondedAt: new Date().toISOString()
      }), 800));
    }
    const response = await api.put(`/service-request-assignment/${assignmentId}/reject`, { rejectionReason });
    return response.data;
  },

  arrive: async (requestId: number): Promise<any> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({
        requestId,
        status: "TECHNICIAN_ARRIVED",
        arrivedAt: new Date().toISOString()
      }), 800));
    }
    const response = await api.put(`/service-request-assignment/${requestId}/arrive`, {});
    return response.data;
  },

  start: async (requestId: number): Promise<any> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve({
        requestId,
        status: "IN_PROGRESS",
        startedAt: new Date().toISOString()
      }), 800));
    }
    const response = await api.put(`/service-request-assignment/${requestId}/start`, {});
    return response.data;
  },

  complete: async (requestId: number, finalPrice: number): Promise<any> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) =>
        setTimeout(() =>
          resolve({
            requestId,
            status: "COMPLETED",
            finalPrice,
            completedAt: new Date().toISOString()
          }),
          800
        )
      );
    }
    const response = await api.put(
      `/service-request-assignment/${requestId}/complete`,
      finalPrice
    );

    return response.data;
  }

};
