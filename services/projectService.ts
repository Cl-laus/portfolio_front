import api from './api';
import { Project, ProjectSummary } from '@/types';

export interface CreateProjectPayload {
  title: string;
  summary: string;
  description: string;
  links?: Record<string, string> | null;
  technologies: number[];
}

export interface UpdateProjectPayload {
  displayOrder?: number;
  title?: string;
  summary?: string;
  description?: string;
  links?: Record<string, string> | null;
  technologies?: number[];
}

export const projectService = {

  // ─── Public ───────────────────────────────────────────────

  getTop3: async (): Promise<ProjectSummary[]> => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/api/projects/all');
    return response.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  },

  // ─── Admin ────────────────────────────────────────────────

  create: async (payload: CreateProjectPayload): Promise<Project> => {
    const response = await api.post('/api/admin/projects', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateProjectPayload): Promise<Project> => {
    const response = await api.patch(`/api/admin/projects/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/projects/${id}`);
  },

  // ─── Images ───────────────────────────────────────────────

addImages: async (id: number, files: File[]): Promise<Project> => {
  const formData = new FormData();
  files.slice(0, 10).forEach(file => formData.append('files[]', file));
  const response = await api.post(`/api/admin/projects/${id}/images`, formData);
  return response.data;
},

deleteImage: async (imageId: number): Promise<void> => {
  await api.delete(`/api/admin/images/${imageId}`);
},

  // ─── Technologies ─────────────────────────────────────────

  addTechnology: async (projectId: number, technoId: number): Promise<Project> => {
    const response = await api.post(`/api/admin/projects/${projectId}/technologies/${technoId}`);
    return response.data;
  },

  removeTechnology: async (projectId: number, technoId: number): Promise<Project> => {
    const response = await api.delete(`/api/admin/projects/${projectId}/technologies/${technoId}`);
    return response.data;
  },
};