import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import './MyProducts.css';

const MyProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getMyProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load your products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(product => product._id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      alert('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  if (user?.role !== 'farmer') {
    return (
      <div className="my-products-page">
        <div className="container">
          <div className="not-authorized">
            <h2>Farmer Account Required</h2>
            <p>This page is only available for farmers to manage their products.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-products-page">
        <div className="container">
          <Loader text="Loading your products..." />
        </div>
      </div>
    );
  }

  return (
    <div className="my-products-page">
      <div className="container">
        <div className="page-header">
          <h1>My Products</h1>
          <p>Manage your listed products and track their availability</p>
          <Link to="/sell" className="btn btn-primary">
            + Add New Product
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        {products.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3>No Products Listed</h3>
            <p>You haven't listed any products yet. Start selling by adding your first product!</p>
            <Link to="/sell" className="btn btn-primary">
              List Your First Product
            </Link>
          </div>
        ) : (
          <div className="products-management">
            <div className="products-stats">
              <div className="stat-card">
                <h3>{products.length}</h3>
                <p>Total Products</p>
              </div>
              <div className="stat-card">
                <h3>{products.filter(p => p.isAvailable).length}</h3>
                <p>Available</p>
              </div>
              <div className="stat-card">
                <h3>{products.filter(p => !p.isAvailable).length}</h3>
                <p>Out of Stock</p>
              </div>
            </div>

            <div className="products-list">
              {products.map(product => (
                <div key={product._id} className="product-management-card">
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">₹{product.price} / {product.unit}</p>
                    <p className="product-quantity">
                      Quantity: {product.quantity} {product.unit}
                    </p>
                    <div className="product-status">
                      <span className={`status-badge ${product.isAvailable ? 'available' : 'out-of-stock'}`}>
                        {product.isAvailable ? 'Available' : 'Out of Stock'}
                      </span>
                      {product.organic && <span className="organic-badge">Organic</span>}
                    </div>
                  </div>
                  
                  <div className="product-actions">
                    <Link 
                      to={`/products/${product._id}`} 
                      className="btn btn-outline"
                    >
                      View
                    </Link>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;