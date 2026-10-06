import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Transactions from './pages/transactions';
import CreateTransaction from './pages/CreateTransaction';
import TransactionDetail from './pages/TransactionDetail';
import Tasks from './pages/tasks';
import NotificationsPage from './pages/NotificationsPage';
import NotificationPreferences from './pages/NotificationPreferences';
import SellerForm from './pages/SellerForm';
import BuyerForm from './pages/BuyerForm';
import LandlordForm from './pages/LandlordForm';
import TenantForm from './pages/TenantForm';
import Admin from './pages/admin';
import AgentProfileSettings from './pages/AgentProfileSettings';
import CommissionsPage from './pages/CommissionsPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/commissions"
            element={
              <ProtectedRoute>
                <CommissionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions/:id"
            element={
              <ProtectedRoute>
                <TransactionDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notification-preferences"
            element={
              <ProtectedRoute>
                <NotificationPreferences />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions/new"
            element={
              <ProtectedRoute>
                <CreateTransaction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions/new/seller"
            element={
              <ProtectedRoute>
                <SellerForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions/new/buyer"
            element={
              <ProtectedRoute>
                <BuyerForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions/new/landlord"
            element={
              <ProtectedRoute>
                <LandlordForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions/new/tenant"
            element={
              <ProtectedRoute>
                <TenantForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/agent-settings"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AgentProfileSettings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
// Force rebuild Tue Oct  6 20:36:41 UTC 2026
