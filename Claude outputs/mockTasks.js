// Mock tasks data
export const mockTasks = [
  // Tasks for txn-001 (Buyer Resale)
  {
    id: 'txn-001-task-1',
    transactionId: 'txn-001',
    type: 'create-social-media-post',
    description: 'Create social media post for new buyer contract',
    assignedTo: 'user-020', // Stacey (Marketing)
    status: 'pending',
    dueDate: '2026-09-15',
    priority: 'high',
    createdDate: '2026-09-15',
  },
  {
    id: 'txn-001-task-2',
    transactionId: 'txn-001',
    type: 'confirm-earnest-money',
    description: 'Confirm 1st earnest money deposit submitted',
    assignedTo: 'user-010', // Patricia (TC)
    status: 'pending',
    dueDate: '2026-09-22',
    priority: 'high',
    createdDate: '2026-09-15',
  },
  {
    id: 'txn-001-task-3',
    transactionId: 'txn-001',
    type: 'send-insurance-email',
    description: 'Send insurance recommendations email to buyer',
    assignedTo: 'user-002', // Amanda (Agent)
    status: 'completed',
    dueDate: '2026-09-16',
    priority: 'medium',
    createdDate: '2026-09-15',
    completedDate: '2026-09-16',
  },

  // Tasks for txn-006 (Seller Listing)
  {
    id: 'txn-006-task-1',
    transactionId: 'txn-006',
    type: 'write-listing-script',
    description: 'Write listing video script (due 3 days before photos)',
    assignedTo: 'user-004', // Sarah (Agent)
    status: 'completed',
    dueDate: '2026-09-19',
    priority: 'high',
    createdDate: '2026-09-20',
    completedDate: '2026-09-19',
  },
  {
    id: 'txn-006-task-2',
    transactionId: 'txn-006',
    type: 'create-brochure',
    description: 'Create brochure (1 day after photos) + approval request',
    assignedTo: 'user-020', // Stacey (Marketing)
    status: 'pending',
    dueDate: '2026-09-23',
    priority: 'high',
    createdDate: '2026-09-20',
  },

  // Tasks for txn-004 (Buyer New Construction)
  {
    id: 'txn-004-task-1',
    transactionId: 'txn-004',
    type: 'insurance-recommendations',
    description: 'Send insurance recommendations email (special language: not tied to builder incentives)',
    assignedTo: 'user-002', // Amanda (Agent)
    status: 'pending',
    dueDate: '2026-08-11', // 10 days after contract
    priority: 'medium',
    createdDate: '2026-08-01',
  },

  // General Agent Tasks
  {
    id: 'agent-task-001',
    type: 'follow-up-check-in',
    description: '3-day follow-up check-in with David Garcia',
    assignedTo: 'user-004', // Sarah
    status: 'completed',
    dueDate: '2026-09-18',
    priority: 'medium',
    createdDate: '2026-09-15',
    completedDate: '2026-09-18',
    relatedTransaction: 'txn-003',
  },
  {
    id: 'agent-task-002',
    type: 'calendar-sync',
    description: 'Sync closing dates with Google Calendar',
    assignedTo: 'user-002',
    status: 'pending',
    dueDate: '2026-09-30',
    priority: 'low',
    createdDate: '2026-09-25',
  },

  // TC Tasks
  {
    id: 'tc-task-001',
    type: 'enter-skyslope',
    description: 'Enter txn-001 into Skyslope',
    assignedTo: 'user-010', // Patricia
    status: 'pending',
    dueDate: '2026-09-16',
    priority: 'high',
    createdDate: '2026-09-15',
    relatedTransaction: 'txn-001',
  },
  {
    id: 'tc-task-002',
    type: 'enter-mls',
    description: 'Enter txn-006 into MLS',
    assignedTo: 'user-010', // Patricia
    status: 'in-progress',
    dueDate: '2026-09-25',
    priority: 'high',
    createdDate: '2026-09-20',
    relatedTransaction: 'txn-006',
  },

  // Marketing Tasks
  {
    id: 'marketing-task-001',
    type: 'create-feature-cards',
    description: 'Create feature cards for 5678 Island Harbor Lane (1 day after photos)',
    assignedTo: 'user-020', // Stacey
    status: 'pending',
    dueDate: '2026-09-23',
    priority: 'high',
    createdDate: '2026-09-20',
    relatedTransaction: 'txn-006',
  },
  {
    id: 'marketing-task-002',
    type: 'create-mailer',
    description: 'Create mailer for 5678 Island Harbor Lane (1 day after photos)',
    assignedTo: 'user-020', // Stacey
    status: 'pending',
    dueDate: '2026-09-23',
    priority: 'high',
    createdDate: '2026-09-20',
    relatedTransaction: 'txn-006',
  },

  // Local Assistant Tasks
  {
    id: 'assistant-task-001',
    type: 'print-distribution',
    description: 'Print and distribute feature cards for 5678 Island Harbor Lane',
    assignedTo: 'user-030', // Sue
    status: 'pending',
    dueDate: '2026-09-25',
    priority: 'medium',
    createdDate: '2026-09-23',
    relatedTransaction: 'txn-006',
  },

  // Closing Concierge Tasks
  {
    id: 'concierge-task-001',
    type: 'closing-checklist',
    description: 'Prepare closing checklist for 8765 Grand Bay Court',
    assignedTo: 'user-040', // Diana
    status: 'completed',
    dueDate: '2026-09-08',
    priority: 'high',
    createdDate: '2026-09-01',
    completedDate: '2026-09-08',
    relatedTransaction: 'txn-003',
  },
];

export const getTasksByAssignee = (userId) => {
  return mockTasks.filter(t => t.assignedTo === userId);
};

export const getTasksByStatus = (status) => {
  return mockTasks.filter(t => t.status === status);
};

export const getTasksByTransaction = (transactionId) => {
  return mockTasks.filter(t => t.transactionId === transactionId);
};

export const getTaskById = (id) => {
  return mockTasks.find(t => t.id === id);
};

export const getTasksByDueDate = (dueDate) => {
  return mockTasks.filter(t => new Date(t.dueDate) <= new Date(dueDate));
};

export const getUpcomingTasks = (daysAhead = 7) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return mockTasks.filter(t => {
    const taskDate = new Date(t.dueDate);
    return taskDate >= today && taskDate <= futureDate && t.status !== 'completed';
  });
};

export const getOverdueTasks = () => {
  const today = new Date();
  return mockTasks.filter(t => {
    const taskDate = new Date(t.dueDate);
    return taskDate < today && t.status !== 'completed';
  });
};
