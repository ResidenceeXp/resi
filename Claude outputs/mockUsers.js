// Mock user data with login credentials for testing
export const mockUsers = [
  // AGENTS
  {
    id: 'user-001',
    firstName: 'Kelly',
    lastName: 'Olin',
    email: 'kelly@residence.exp',
    password: 'password123', // Hash this in production
    phone: '239-488-5900',
    role: 'admin',
    dateHired: '2024-01-15',
    status: 'active',
    permissions: ['view_all_transactions', 'create_transaction', 'manage_users', 'manage_system', 'view_own_transactions'],
    dashboard: 'admin',
    teams: ['residential', 'luxury'],
  },
  {
    id: 'user-002',
    firstName: 'Amanda',
    lastName: 'Bolduc',
    email: 'amanda@residence.exp',
    password: 'password123',
    phone: '239-555-0001',
    role: 'agent',
    dateHired: '2024-02-01',
    status: 'active',
    permissions: ['view_own_transactions', 'create_transaction', 'approve_marketing'],
    dashboard: 'agent',
    teams: ['residential'],
  },
  {
    id: 'user-003',
    firstName: 'James',
    lastName: 'Mitchell',
    email: 'james@residence.exp',
    password: 'password123',
    phone: '239-555-0002',
    role: 'agent',
    dateHired: '2024-01-10',
    status: 'active',
    permissions: ['view_own_transactions', 'create_transaction', 'approve_marketing'],
    dashboard: 'agent',
    teams: ['residential', 'luxury'],
  },
  {
    id: 'user-004',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@residence.exp',
    password: 'password123',
    phone: '239-555-0003',
    role: 'agent',
    dateHired: '2024-02-15',
    status: 'active',
    permissions: ['view_own_transactions', 'create_transaction', 'approve_marketing'],
    dashboard: 'agent',
    teams: ['residential'],
  },
  {
    id: 'user-005',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael@residence.exp',
    password: 'password123',
    phone: '239-555-0004',
    role: 'agent',
    dateHired: '2024-03-01',
    status: 'active',
    permissions: ['view_own_transactions', 'create_transaction', 'approve_marketing'],
    dashboard: 'agent',
    teams: ['investment'],
  },

  // TRANSACTION COORDINATOR
  {
    id: 'user-010',
    firstName: 'Patricia',
    lastName: 'Thompson',
    email: 'patricia@residence.exp',
    password: 'password123',
    phone: '239-555-0010',
    role: 'tc',
    dateHired: '2023-06-01',
    status: 'active',
    permissions: ['view_all_transactions', 'update_deadlines', 'manage_tasks', 'enter_mls_skyslope'],
    dashboard: 'tc',
    teams: [],
  },

  // MARKETING MANAGER - Stacey Moore
  {
    id: 'user-020',
    firstName: 'Stacey',
    lastName: 'Moore',
    email: 'stacey@residence.exp',
    password: 'password123',
    phone: '239-555-0020',
    role: 'marketing',
    dateHired: '2023-01-01',
    status: 'active',
    permissions: ['view_all_transactions', 'create_marketing', 'approve_workflow', 'manage_tasks'],
    dashboard: 'marketing',
    teams: [],
  },

  // LOCAL ASSISTANT - Sue McGill
  {
    id: 'user-030',
    firstName: 'Sue',
    lastName: 'McGill',
    email: 'sue@residence.exp',
    password: 'password123',
    phone: '239-555-0030',
    role: 'assistant',
    dateHired: '2023-03-01',
    status: 'active',
    permissions: ['view_all_transactions', 'manage_distribution', 'complete_tasks'],
    dashboard: 'assistant',
    teams: [],
  },

  // CLOSING CONCIERGE
  {
    id: 'user-040',
    firstName: 'Diana',
    lastName: 'Williams',
    email: 'diana@residence.exp',
    password: 'password123',
    phone: '239-555-0040',
    role: 'concierge',
    dateHired: '2024-01-20',
    status: 'active',
    permissions: ['view_assigned_transactions', 'view_closing_checklist', 'complete_tasks'],
    dashboard: 'concierge',
    teams: [],
  },
];

export const getUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const getUserById = (id) => {
  const user = mockUsers.find(u => u.id === id);
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const getUsersByRole = (role) => {
  return mockUsers.filter(u => u.role === role).map(({ password: _, ...user }) => user);
};
