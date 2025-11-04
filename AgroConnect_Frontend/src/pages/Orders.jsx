import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const orders = [];

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <a href="/products" className="btn btn-primary">Start Shopping</a>
          </div>
        ) : (
          <div className="orders-list">
            {/* Orders would be listed here */}
            <p>Your orders will appear here once you make purchases.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;