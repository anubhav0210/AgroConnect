import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="error-content">
          <div className="error-icon">🔍</div>
          <h1>Page Not Found</h1>
          <p>
            The page you're looking for doesn't exist or may have been moved.
            Please check the URL or navigate back to our homepage.
          </p>
          <div className="action-buttons">
            <Link to="/" className="btn btn-primary">Go Home</Link>
            <Link to="/products" className="btn btn-outline">Browse Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;