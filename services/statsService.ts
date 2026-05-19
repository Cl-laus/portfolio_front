import api from './api';

interface ProjectStat {
  project_id: number;
  visits: number;
}

export const statsService = {
  getProjectStats: async (): Promise<Map<number, number>> => {
    const { data } = await api.get<{ stats: ProjectStat[] }>('/api/admin/stats');
    return new Map(data.stats.map(s => [s.project_id, s.visits]));
  },
};
