import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
  const categories = [
    {
      name: 'Vegetables',
      description: 'Fresh and organic vegetables directly from local farms',
      image: '🥦',
      count: '50+ Products',
      link: '/products?category=vegetables'
    },
    {
      name: 'Fruits',
      description: 'Seasonal fruits harvested at peak ripeness',
      image: '🍎',
      count: '30+ Products',
      link: '/products?category=fruits'
    },
    {
      name: 'Grains & Cereals',
      description: 'High-quality grains and cereals for your kitchen',
      image: '🌾',
      count: '25+ Products',
      link: '/products?category=grains'
    },
    {
      name: 'Dairy Products',
      description: 'Fresh milk, cheese, and other dairy items',
      image: '🥛',
      count: '20+ Products',
      link: '/products?category=dairy'
    },
    {
      name: 'Poultry & Eggs',
      description: 'Farm-fresh eggs and poultry products',
      image: '🐔',
      count: '15+ Products',
      link: '/products?category=poultry'
    },
    {
      name: 'Seeds & Saplings',
      description: 'Quality seeds and plants for your garden',
      image: '🌱',
      count: '40+ Products',
      link: '/products?category=seeds'
    },
    {
      name: 'Fertilizers',
      description: 'Organic and chemical fertilizers for healthy plants',
      image: '🧪',
      count: '35+ Products',
      link: '/products?category=fertilizers'
    },
    {
      name: 'Farming Tools',
      description: 'Essential tools for modern farming',
      image: '🔧',
      count: '60+ Products',
      link: '/products?category=tools'
    }
  ];

  return (
    <div className="categories-page">
      <div className="container">
        <div className="page-header">
          <h1>Product Categories</h1>
          <p>Browse our wide range of agricultural products</p>
        </div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link key={index} to={category.link} className="category-card-large">
              <div className="category-icon-large">{category.image}</div>
              <div className="category-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="product-count">{category.count}</span>
              </div>
              <div className="category-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;