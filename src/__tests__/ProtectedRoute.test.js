import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Mock the auth context
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
    userRole: 'Admin',
    loading: false,
  }),
}));

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  it('should render children when user is authenticated', () => {
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should enforce role-based access control', () => {
    const { rerender } = render(
      <BrowserRouter>
        <ProtectedRoute requiredRole="Admin">
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
