import api from "./api";
import { SocialNetwork } from "@/types";

export const socialNetworkService = {

  
  getAll: async (): Promise<SocialNetwork[]> => {
    const response = await api.get("/api/social-networks");
    return response.data;
  },

  
  create: async (data: Omit<SocialNetwork, "id">) => {
    const response = await api.post(
      "/api/admin/social-networks",
      data
    );
    return response.data;
  },

  
  update: async (data: SocialNetwork) => {
    const response = await api.patch(
      `/api/admin/social-networks/${data.id}`,
      data
    );
    return response.data;
  },

  
  delete: async (id: number) => {
    await api.delete(`/api/admin/social-networks/${id}`);
  },
};