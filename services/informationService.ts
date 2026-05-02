import api from "./api";
import { Information } from "@/types";

export const informationService = {

 
  get: async (): Promise<Information> => {
    const response = await api.get("/api/informations");
    return response.data[0];
  },

  
  update: async (data: Information): Promise<Information> => {
    const response = await api.patch(
      `/api/admin/informations/${data.id}`,
      data
    );
    return response.data;
  },

  uploadPhoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await api.post(
      `/api/admin/informations/${id}/photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};