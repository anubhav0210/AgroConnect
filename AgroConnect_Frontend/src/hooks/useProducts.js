import { useState, useEffect } from 'react';
import { productService } from '../services/ProductService';


export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProducts(filters);
      setProducts(response.data);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.searchProducts(searchParams);
      setProducts(response.data);
      setPagination(response.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
    searchProducts
  };
};