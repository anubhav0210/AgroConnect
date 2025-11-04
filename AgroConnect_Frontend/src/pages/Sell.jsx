import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import './Sell.css';

const Sell = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    quantity: '',
    unit: 'kg',
    organic: false,
    harvestDate: '',
    minOrder: 1,
    maxOrder: '',
    certifications: '',
    tags: ''
  });

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

  const units = ['kg', 'g', 'litre', 'ml', 'piece', 'dozen', 'packet'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        minOrder: parseInt(formData.minOrder),
        maxOrder: formData.maxOrder ? parseInt(formData.maxOrder) : undefined,
        certifications: formData.certifications ? 
          formData.certifications.split(',').map(c => c.trim()).filter(c => c) : [],
        tags: formData.tags ? 
          formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        isAvailable: true
      };

      console.log('Creating product:', productData);
      
      await productService.createProduct(productData);
      
      setSuccess('Product listed successfully! It is now available for purchase.');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        quantity: '',
        unit: 'kg',
        organic: false,
        harvestDate: '',
        minOrder: 1,
        maxOrder: '',
        certifications: '',
        tags: ''
      });
    } catch (err) {
      console.error('Product creation error:', err);
      setError(err.response?.data?.message || 'Failed to list product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'farmer') {
    return (
      <div className="sell-page">
        <div className="container">
          <div className="not-authorized">
            <h2>Farmer Account Required</h2>
            <p>You need a farmer account to sell products on AgroConnect.</p>
            <p>Please update your account type in your profile settings to start selling.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sell-page">
      <div className="container">
        <div className="sell-header">
          <h1>Sell Your Products</h1>
          <p>List your agricultural products to start selling to buyers</p>
        </div>

        {success && (
          <div className="success">
            <strong>Success!</strong> {success}
          </div>
        )}
        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="sell-form">
          <div className="form-section">
            <h3>Product Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="e.g., Organic Tomatoes, Fresh Milk"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Describe your product in detail. Include quality, freshness, farming methods, etc."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-control"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Available Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="form-control"
                  min="0"
                  step="0.1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="e.g., 100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit *</label>
                <select
                  id="unit"
                  name="unit"
                  className="form-control"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="harvestDate">Harvest Date</label>
                <input
                  type="date"
                  id="harvestDate"
                  name="harvestDate"
                  className="form-control"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subCategory">Sub Category</label>
                <input
                  type="text"
                  id="subCategory"
                  name="subCategory"
                  className="form-control"
                  value={formData.subCategory}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., Leafy Vegetables, Citrus Fruits"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="minOrder">Minimum Order</label>
                <input
                  type="number"
                  id="minOrder"
                  name="minOrder"
                  className="form-control"
                  min="1"
                  value={formData.minOrder}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Minimum quantity per order"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxOrder">Maximum Order</label>
                <input
                  type="number"
                  id="maxOrder"
                  name="maxOrder"
                  className="form-control"
                  min="1"
                  value={formData.maxOrder}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Maximum quantity per order"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="organic"
                    checked={formData.organic}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  Organic Product
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="certifications">Certifications</label>
              <input
                type="text"
                id="certifications"
                name="certifications"
                className="form-control"
                value={formData.certifications}
                onChange={handleChange}
                disabled={loading}
                placeholder="Separate multiple certifications with commas"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="form-control"
                value={formData.tags}
                onChange={handleChange}
                disabled={loading}
                placeholder="Separate tags with commas (e.g., fresh, local, premium, seasonal)"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <Loader size="small" text="" /> : 'List Product for Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Sell;