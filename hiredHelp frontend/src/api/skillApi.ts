import { api, USE_MOCK_DATA } from "../config/api";
import { Skill } from "../types";
import { mockSkills } from "../utils/mockData";

export const skillApi = {
  getAll: async (): Promise<Skill[]> => {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => setTimeout(() => resolve(mockSkills), 500));
    }
    const response = await api.get("/skills/getAllSkills");
    return response.data;
  }
};
