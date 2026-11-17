import { api, USE_MOCK_DATA } from "../config/api";
import { Skill } from "../types";

export const skillApi = {
  getAll: async (): Promise<Skill[]> => {
    const response = await api.get("/skills/getAllSkills");
    return response.data;
  }
};
