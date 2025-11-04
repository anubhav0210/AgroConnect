import api from './api';

export const productService = {
  // Get all products with filters
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response;
  },

  // Get single product
  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Create product (Farmer only)
  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (Farmer only)
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (Farmer only)
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Get farmer's products
  async getMyProducts() {
    const response = await api.get('/products/my-products');
    return response;
  },

  // Get products by specific farmer
  async getFarmerProducts(farmerId) {
    const response = await api.get(`/products/farmer/${farmerId}`);
    return response;
  },

  // Search products
  async searchProducts(queryParams) {
    const response = await api.get('/products/search', { params: queryParams });
    return response;
  }
};