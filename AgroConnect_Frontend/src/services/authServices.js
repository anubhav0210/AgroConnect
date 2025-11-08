import api from './api/api.js';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },
   async updateProfile(userData) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  async changePassword(passwordData) {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  }
};