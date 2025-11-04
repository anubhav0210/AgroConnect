import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import './Home.css';

const Home = () => {
  const { products, loading, error } = useProducts({ limit: 8 });

  const categories = [
    {
      name: 'Vegetables',
      image: '🥦',
      description: 'Fresh organic vegetables',
      link: '/products?category=vegetables'
    },
    {
      name: 'Fruits',
      image: '🍎',
      description: 'Seasonal fresh fruits',
      link: '/products?category=fruits'
    },
    {
      name: 'Grains',
      image: '🌾',
      description: 'Quality grains & cereals',
      link: '/products?category=grains'
    },
    {
      name: 'Dairy',
      image: '🥛',
      description: 'Fresh dairy products',
      link: '/products?category=dairy'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Fresh From Farm to Your Home</h1>
            <p>Connect directly with farmers and get the freshest agricultural products at the best prices.</p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
              <Link to="/sell" className="btn btn-outline">Sell Products</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-placeholder">
              🌱 Fresh Farm Products
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to={category.link} className="category-card">
                <div className="category-icon">{category.image}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="btn btn-outline">View All</Link>
          </div>

          {loading ? (
            <Loader text="Loading featured products..." />
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="container">
          <h2>Why Choose AgroConnect?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🚜</div>
              <h3>Direct from Farmers</h3>
              <p>Buy directly from verified farmers without middlemen</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🌿</div>
              <h3>Fresh & Organic</h3>
              <p>Get the freshest products with quality assurance</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive prices with no additional charges</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery to your doorstep</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;