import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CreateOrderPage from './pages/CreateOrderPage';
import PortfolioPage from './pages/PortfolioPage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

const OrderDetailWithWebSocket = () => {
  const { id } = useParams();
  return (
    <WebSocketProvider orderId={id}>
      <OrderDetailPage />
    </WebSocketProvider>
  );
};

import { useParams } from 'react-router-dom';

function AppRoutes() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 56px)', paddingTop: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailWithWebSocket /></ProtectedRoute>} />
          <Route path="/create-order" element={<ProtectedRoute><CreateOrderPage /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;