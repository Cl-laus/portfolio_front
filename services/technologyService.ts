import api from './api';
import { Technology } from '@/types';

export const technologyService = {
  getAll: async (): Promise<Technology[]> => {
    const response = await api.get('/api/technologies');
    return response.data;
  },

  getById: async (id: number): Promise<Technology> => {
    const response = await api.get(`/api/technologies/${id}`);
    return response.data;
  },

  create: async (tech: Partial<Technology>): Promise<Technology> => {
    const response = await api.post('/api/admin/technologies', tech);
    return response.data;
  },

  update: async (tech: Technology): Promise<Technology> => {
    const response = await api.patch(`/api/admin/technologies/${tech.id}`, tech);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/technologies/${id}`);
  },
};