import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="unauthorized-page">
      <div className="container">
        <div className="error-content">
          <div className="error-icon">🚫</div>
          <h1>Access Denied</h1>
          <p>
            {user ? (
              <>
                Sorry, <strong>{user.name}</strong>! You don't have permission to access this page.
                {user.role === 'buyer' && " This section is only available for farmers."}
                {user.role === 'farmer' && " This requires administrator privileges."}
              </>
            ) : (
              "Please log in to access this page."
            )}
          </p>
          <div className="action-buttons">
            <Link to="/" className="btn btn-primary">Go Home</Link>
            {user ? (
              <Link to="/profile" className="btn btn-outline">View Profile</Link>
            ) : (
              <Link to="/login" className="btn btn-outline">Login</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;