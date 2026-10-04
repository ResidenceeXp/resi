// Authentication utilities for JWT and token management
import { mockUsers } from './mockUsers';

const TOKEN_KEY = 'resi_auth_token';
const USER_KEY = 'resi_user';

// Simple JWT-like token generator (for mock)
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };

  // In production, use a proper JWT library
  return btoa(JSON.stringify(payload));
};

export const login = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken(userWithoutPassword);

  // Store in localStorage
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));

  return { success: true, user: userWithoutPassword, token };
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getCurrentToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getCurrentToken() && !!getCurrentUser();
};

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenValid = (token) => {
  try {
    const payload = decodeToken(token);
    if (!payload) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (error) {
    return false;
  }
};

export const hasPermission = (requiredPermission) => {
  const user = getCurrentUser();
  if (!user) return false;

  return user.permissions && user.permissions.includes(requiredPermission);
};

export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  if (!user) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }

  return user.role === requiredRole;
};

// Role-based permission sets
export const RolePermissions = {
  agent: [
    'view_own_transactions',
    'create_transaction',
    'approve_marketing',
  ],
  tc: [
    'view_all_transactions',
    'update_deadlines',
    'manage_tasks',
    'enter_mls_skyslope',
  ],
  marketing: [
    'view_all_transactions',
    'create_marketing',
    'approve_workflow',
    'manage_tasks',
  ],
  assistant: [
    'view_all_transactions',
    'manage_distribution',
    'complete_tasks',
  ],
  concierge: [
    'view_assigned_transactions',
    'view_closing_checklist',
    'complete_tasks',
  ],
  admin: [
    'view_all_transactions',
    'create_transaction',
    'manage_users',
    'manage_system',
    'view_own_transactions',
    'update_deadlines',
    'manage_tasks',
    'create_marketing',
    'approve_workflow',
    'view_analytics',
  ],
};
