import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async getOrders() {
    const response = await api.get('/orders');
    return response;
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};