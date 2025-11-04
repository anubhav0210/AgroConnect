import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import Sell from './pages/Sell';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import MyProducts from './pages/MyProducts';
// Styles
import './App.css';

// Loading component for authentication check
const AuthLoading = () => (
  <div className="auth-loading">
    <Loader text="Loading AgroConnect..." />
  </div>
);

// Public Route Component - Redirect to home if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <AuthLoading />;
  }
  
  if (isAuthenticated) {
    // Redirect to the page they were trying to access or home
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  
  return children;
};

// Private Route Component - Redirect to login if not authenticated
const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    // Save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Farmer Route Component - Only for farmers
const FarmerRoute = ({ children }) => {
  return (
    <PrivateRoute requiredRole="farmer">
      {children}
    </PrivateRoute>
  );
};

// Main App Component with route key for proper re-rendering
function AppContent() {
  const { loading } = useAuth();
  const location = useLocation(); // This forces re-render on route change

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="App">
        <AuthLoading />
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        {/* Add key to Routes to force re-render on location change */}
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />
          
          {/* Authentication Routes - Only accessible when NOT logged in */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes - Require authentication */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } 
          />
          
          {/* Farmer Only Routes */}
          <Route 
            path="/sell" 
            element={
              <FarmerRoute>
                <Sell />
              </FarmerRoute>
            } 
          />
          <Route 
            path="/my-products" 
            element={
              <FarmerRoute>
                <div className="container">
                  <div className="page-header">
                    <h1>My Products</h1>
                    <p>Manage your listed products</p>
                  </div>
                  <MyProducts />
                  <div className="card">
                    <p>Your product management dashboard will appear here.</p>
                    <p>You can add, edit, and manage your agricultural products.</p>
                  </div>
                </div>
              </FarmerRoute>
            } 
          />
          
          {/* Catch all route - 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

// Main App Wrapper with Providers
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;