import { api, USE_MOCK_DATA } from "../config/api";
import { Review, CreateReviewRequest } from "../types";

export const reviewApi = {
  create: async (
    requestId: number,
    data: CreateReviewRequest
  ): Promise<Review> => {
    const response = await api.post(`/reviews/${requestId}`, data);
    return response.data;
  },

  update: async (
    requestId: number,
    data: CreateReviewRequest
  ): Promise<Review> => {
    const response = await api.put(`/reviews/${requestId}`, data);
    return response.data;
  }
};