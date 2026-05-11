// services/authService.ts
import api from './api';

const TOKEN_KEY = 'token';

export const authService = {
  login: async (username: string, password: string): Promise<void> => {
    const response = await api.post('/api/batcave', { username, password });
    const { token } = response.data;
    localStorage.setItem(TOKEN_KEY, token);
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    if (typeof window !== 'undefined') {
      window.location.href = '/batcave'; // redirige vers login
    }
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expired = payload.exp * 1000 < Date.now();

      if (expired) {
        // Token expiré → supprimer et considérer non connecté
        localStorage.removeItem(TOKEN_KEY);
        return false;
      }

      return true;
    } catch {
      // Si token mal formé → supprimer et considérer non connecté
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
  },
};