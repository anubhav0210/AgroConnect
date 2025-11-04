import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Debug: Check if component mounts and auth state
  useEffect(() => {
    console.log('Register component mounted');
    console.log('isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      
      console.log('Attempting registration with:', registerData);
      
      const result = await register(registerData);
      
      if (result.success) {
        console.log('Registration successful, redirecting...');
        navigate('/', { replace: true });
      } else {
        setError(result.message);
        console.log('Registration failed:', result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a simple test to see if component renders
  console.log('Register component rendering...');

  return (
    <div className="auth-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="auth-card" style={{ border: '2px solid #4a7c3a', background: 'white' }}>
          <div className="auth-header">
            <h1 style={{ color: '#2d5016' }}>Join AgroConnect</h1>
            <p>Create your account to start buying or selling</p>
          </div>

          {error && (
            <div className="error" style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '5px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your full name"
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your email address"
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your phone number"
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">I want to *</label>
              <select
                id="role"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px', width: '100%', background: 'white' }}
              >
                <option value="buyer">Buy Products</option>
                <option value="farmer">Sell Products</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength="6"
                placeholder="Enter your password (min. 6 characters)"
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                minLength="6"
                placeholder="Confirm your password"
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px', width: '100%' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-btn"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: '#2d5016', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? <Loader size="small" text="" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login" style={{ color: '#2d5016', fontWeight: 'bold' }}>Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;