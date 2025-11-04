import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  },

  async updatePassword(passwordData) {
    const response = await api.put('/auth/updatepassword', passwordData);
    return response.data;
  },

  async logout() {
    await api.get('/auth/logout');
  }
};