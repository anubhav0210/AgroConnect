import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await productService.getProduct(id);
      setProduct(productData);
    } catch (err) {
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    const result = await addToCart(product._id, quantity);
    if (result.success) {
      alert('Product added to cart!');
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <Loader text="Loading product..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-state">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <Link to="/products" className="btn btn-primary">Back to Products</Link>
          </div>
        </div>
      </div>
    );
  }

  const maxQuantity = Math.min(product.quantity, product.maxOrder || product.quantity);

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> &gt; 
          <Link to="/products">Products</Link> &gt; 
          <span>{product.name}</span>
        </nav>

        <div className="product-detail">
          <div className="product-gallery">
            {product.images && product.images.length > 0 ? (
              <div className="main-image">
                <img 
                  src={product.images[0].url} 
                  alt={product.name}
                />
              </div>
            ) : (
              <div className="main-image placeholder">
                🥦 No Image Available
              </div>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <span className="category">{product.category}</span>
              {product.organic && <span className="organic-badge">Organic</span>}
              {product.certifications && product.certifications.length > 0 && (
                <span className="certified-badge">Certified</span>
              )}
            </div>

            <div className="product-price">
              ₹{product.price} / {product.unit}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            <div className="product-details">
              <div className="detail-item">
                <strong>Available Quantity:</strong>
                <span>{product.quantity} {product.unit}</span>
              </div>
              
              <div className="detail-item">
                <strong>Minimum Order:</strong>
                <span>{product.minOrder} {product.unit}</span>
              </div>
              
              {product.maxOrder && (
                <div className="detail-item">
                  <strong>Maximum Order:</strong>
                  <span>{product.maxOrder} {product.unit}</span>
                </div>
              )}
              
              {product.harvestDate && (
                <div className="detail-item">
                  <strong>Harvest Date:</strong>
                  <span>{new Date(product.harvestDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {product.farmer && (
              <div className="farmer-info">
                <h4>Sold By</h4>
                <div className="farmer-details">
                  <strong>{product.farmer.name}</strong>
                  {product.farmer.phone && <span>📞 {product.farmer.phone}</span>}
                  {product.farmer.email && <span>✉️ {product.farmer.email}</span>}
                </div>
              </div>
            )}

            <div className="purchase-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                    min="1"
                    max={maxQuantity}
                    className="quantity-input"
                  />
                  <button 
                    onClick={() => setQuantity(prev => Math.min(maxQuantity, prev + 1))}
                    disabled={quantity >= maxQuantity}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <span className="quantity-limit">Max: {maxQuantity} {product.unit}</span>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable || product.quantity === 0}
                  className="btn btn-primary add-to-cart-btn"
                >
                  {!product.isAvailable || product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button className="btn btn-outline">
                  ♡ Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;