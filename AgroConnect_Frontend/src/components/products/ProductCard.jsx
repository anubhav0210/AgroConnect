import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    const result = await addToCart(product._id, 1);
    if (result.success) {
      alert('Product added to cart!');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0].url} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
            />
          ) : (
            <div className="product-image-placeholder">
              🥦 No Image
            </div>
          )}
          {product.organic && (
            <span className="organic-badge">Organic</span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description
            }
          </p>
          
          <div className="product-meta">
            <span className="product-category">{product.category}</span>
            <span className="product-quantity">
              {product.quantity} {product.unit}
            </span>
          </div>

          <div className="product-footer">
            <div className="product-price">
              ₹{product.price} / {product.unit}
            </div>
            <button 
              className="btn btn-primary add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.isAvailable || product.quantity === 0}
            >
              {!product.isAvailable || product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {product.farmer && (
            <div className="farmer-info">
              <small>By: {product.farmer.name}</small>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;