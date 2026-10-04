import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/globals.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call backend to verify session/token
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

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
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ?
              <Navigate to="/dashboard" /> :
              <Login
                onLoginSuccess={(user, token) => {
                  setCurrentUser(user);
                  setIsAuthenticated(true);
                  localStorage.setItem('token', token);
                }}
              />
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
              <Layout currentUser={currentUser} />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;