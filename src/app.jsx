import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppHeader from './components/AppHeader';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';

function AppRoutes() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading RESIDENCE | eXp Realty...
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ?
              <Navigate to="/dashboard" /> :
              <Login />
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ?
              <Navigate to="/dashboard" /> :
              <Navigate to="/login" />
          }
        />

        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout currentUser={user} />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard currentUser={user} />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
