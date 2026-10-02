// API utilities for communicating with backend (mock/real)
import { getCurrentToken } from './authUtils';
import { mockUsers, getUser } from './mockUsers';
import { mockTransactions, getTransactionsByAgent, getTransactionsByStatus, getTransactionById } from './mockTransactions';
import { mockTasks, getTasksByAssignee, getTasksByStatus as getTasksByStatusFunc } from './mockTasks';

const API_BASE = '/api';

// Mock API responses - in production, these would call a real backend
export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const token = getCurrentToken();

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    // In production, use: return await fetch(`${API_BASE}${endpoint}`, options);
    // For now, handle mock API locally
    return handleMockAPI(endpoint, method, data);
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Mock API handler
const handleMockAPI = async (endpoint, method, data) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Auth endpoints
  if (endpoint === '/auth/login' && method === 'POST') {
    const user = getUser(data.email, data.password);
    if (user) {
      return { ok: true, json: async () => ({ success: true, user }) };
    }
    return { ok: false, json: async () => ({ error: 'Invalid credentials' }) };
  }

  if (endpoint === '/auth/logout' && method === 'POST') {
    return { ok: true, json: async () => ({ success: true }) };
  }

  // Transactions endpoints
  if (endpoint === '/transactions' && method === 'GET') {
    return { ok: true, json: async () => ({ data: mockTransactions }) };
  }

  if (endpoint.match(/^\/transactions\//) && method === 'GET') {
    const id = endpoint.split('/').pop();
    const transaction = getTransactionById(id);
    if (transaction) {
      return { ok: true, json: async () => ({ data: transaction }) };
    }
    return { ok: false, json: async () => ({ error: 'Not found' }) };
  }

  if (endpoint === '/transactions' && method === 'POST') {
    // Create new transaction
    const newTransaction = { ...data, id: `txn-${Date.now()}`, createDate: new Date().toISOString() };
    mockTransactions.push(newTransaction);
    return { ok: true, json: async () => ({ data: newTransaction }) };
  }

  if (endpoint.match(/^\/transactions\/.*\/update/) && method === 'PUT') {
    const id = endpoint.split('/')[2];
    const index = mockTransactions.findIndex(t => t.id === id);
    if (index > -1) {
      mockTransactions[index] = { ...mockTransactions[index], ...data };
      return { ok: true, json: async () => ({ data: mockTransactions[index] }) };
    }
    return { ok: false, json: async () => ({ error: 'Not found' }) };
  }

  // Tasks endpoints
  if (endpoint === '/tasks' && method === 'GET') {
    return { ok: true, json: async () => ({ data: mockTasks }) };
  }

  if (endpoint.match(/^\/tasks\//) && method === 'GET') {
    const id = endpoint.split('/').pop();
    const task = mockTasks.find(t => t.id === id);
    if (task) {
      return { ok: true, json: async () => ({ data: task }) };
    }
    return { ok: false, json: async () => ({ error: 'Not found' }) };
  }

  if (endpoint === '/tasks' && method === 'POST') {
    const newTask = { ...data, id: `task-${Date.now()}`, createdDate: new Date().toISOString() };
    mockTasks.push(newTask);
    return { ok: true, json: async () => ({ data: newTask }) };
  }

  if (endpoint.match(/^\/tasks\/.*/) && method === 'PUT') {
    const id = endpoint.split('/')[2];
    const index = mockTasks.findIndex(t => t.id === id);
    if (index > -1) {
      mockTasks[index] = { ...mockTasks[index], ...data };
      return { ok: true, json: async () => ({ data: mockTasks[index] }) };
    }
    return { ok: false, json: async () => ({ error: 'Not found' }) };
  }

  // Users endpoints
  if (endpoint === '/users' && method === 'GET') {
    return { ok: true, json: async () => ({ data: mockUsers.map(u => {
      const { password: _, ...userWithoutPassword } = u;
      return userWithoutPassword;
    }) }) };
  }

  // Default response
  return { ok: false, json: async () => ({ error: 'Endpoint not found' }) };
};

// Convenience API methods
export const auth = {
  login: (email, password) => apiCall('/auth/login', 'POST', { email, password }),
  logout: () => apiCall('/auth/logout', 'POST'),
};

export const transactions = {
  getAll: () => apiCall('/transactions', 'GET'),
  getById: (id) => apiCall(`/transactions/${id}`, 'GET'),
  create: (data) => apiCall('/transactions', 'POST', data),
  update: (id, data) => apiCall(`/transactions/${id}/update`, 'PUT', data),
  delete: (id) => apiCall(`/transactions/${id}`, 'DELETE'),
};

export const tasks = {
  getAll: () => apiCall('/tasks', 'GET'),
  getById: (id) => apiCall(`/tasks/${id}`, 'GET'),
  create: (data) => apiCall('/tasks', 'POST', data),
  update: (id, data) => apiCall(`/tasks/${id}`, 'PUT', data),
  complete: (id) => apiCall(`/tasks/${id}`, 'PUT', { status: 'completed', completedDate: new Date().toISOString() }),
};

export const users = {
  getAll: () => apiCall('/users', 'GET'),
};
