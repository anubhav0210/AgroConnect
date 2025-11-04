import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import Loader from '../components/common/Loader';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    organic: searchParams.get('organic') || '',
    search: searchParams.get('search') || ''
  });

  const { products, loading, error, refetch } = useProducts();

  useEffect(() => {
    const currentFilters = {};
    for (const [key, value] of searchParams.entries()) {
      currentFilters[key] = value;
    }
    setFilters(currentFilters);
    
    // Fetch products with current filters
    refetch(currentFilters);
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    setSearchParams(newFilters);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Our Products</h1>
          <p>Fresh agricultural products directly from farmers across the region</p>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            <ProductFilters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            <div className="products-header">
              <div className="results-info">
                {!loading && (
                  <p>Showing {products.length} products from various farmers</p>
                )}
              </div>
              <div className="sort-options">
                <select className="form-control" onChange={(e) => {
                  // Add sorting logic here
                  console.log('Sort by:', e.target.value);
                }}>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <Loader text="Loading fresh products..." />
            ) : error ? (
              <div className="error">{error}</div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms to find more products.</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    showFarmer={true} // Show farmer info for all products
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;