import React from 'react';
import './ProductFilters.css';

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const categories = [
    'vegetables',
    'fruits',
    'grains',
    'dairy',
    'poultry',
    'seeds',
    'fertilizers',
    'tools'
  ];

  const handleInputChange = (key, value) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    onFilterChange(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="clear-filters">
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={filters.q || ''}
          onChange={(e) => handleInputChange('q', e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="filter-group">
        <label>Category</label>
        <select
          className="form-control"
          value={filters.category || ''}
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <label>Price Range</label>
        <div className="price-inputs">
          <input
            type="number"
            className="form-control"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleInputChange('minPrice', e.target.value)}
          />
          <span>to</span>
          <input
            type="number"
            className="form-control"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleInputChange('maxPrice', e.target.value)}
          />
        </div>
      </div>

      {/* Organic */}
      <div className="filter-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.organic === 'true'}
            onChange={(e) => handleInputChange('organic', e.target.checked ? 'true' : '')}
          />
          Organic Only
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;