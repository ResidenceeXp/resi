import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, userRole, loading } = useAuth();

  console.log('[PROTECTED_ROUTE] Current state:', { loading, user: user ? user.email : null, userRole });

  if (loading) {
    console.log('[PROTECTED_ROUTE] Still loading auth state');
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    console.log('[PROTECTED_ROUTE] No user found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log('[PROTECTED_ROUTE] Role mismatch. Required:', requiredRole, 'Got:', userRole);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[PROTECTED_ROUTE] Access granted for user:', user.email);
  return children;
}

const styles = {
  loadingContainer: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #333333',
    borderTop: '4px solid #D4AF37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#999999'
  }
};
