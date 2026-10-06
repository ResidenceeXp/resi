import { ref, push, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebaseConfig';

/**
 * Task Templates - defines what tasks should be generated for each transaction type
 * Tasks are generated based on the closing date
 */
const taskTemplates = {
  Buyer: [
    {
      title: 'Pre-Approval Verification',
      description: 'Verify buyer pre-approval letter is current and sufficient',
      daysBeforeClosing: 45,
      priority: 'high',
      category: 'financing'
    },
    {
      title: 'Inspection Period Coordination',
      description: 'Arrange home inspection and coordinate inspector access',
      daysBeforeClosing: 42,
      priority: 'high',
      category: 'inspection'
    },
    {
      title: 'Appraisal Order',
      description: 'Order appraisal from lender',
      daysBeforeClosing: 40,
      priority: 'high',
      category: 'financing'
    },
    {
      title: 'Title Search & Insurance',
      description: 'Order title search and commitment for insurance',
      daysBeforeClosing: 38,
      priority: 'high',
      category: 'legal'
    },
    {
      title: 'Appraisal Review',
      description: 'Review appraisal results and address any issues',
      daysBeforeClosing: 20,
      priority: 'high',
      category: 'financing'
    },
    {
      title: 'Clear Inspection Contingencies',
      description: 'Ensure all inspection items are resolved or waived',
      daysBeforeClosing: 15,
      priority: 'high',
      category: 'inspection'
    },
    {
      title: 'Loan Final Approval',
      description: 'Obtain final loan approval from lender',
      daysBeforeClosing: 10,
      priority: 'high',
      category: 'financing'
    },
    {
      title: 'Final Walkthrough',
      description: 'Schedule and conduct final walkthrough before closing',
      daysBeforeClosing: 3,
      priority: 'critical',
      category: 'closing'
    },
    {
      title: 'Wire Funds for Closing',
      description: 'Arrange wire transfer for down payment and closing costs',
      daysBeforeClosing: 2,
      priority: 'critical',
      category: 'closing'
    },
    {
      title: 'Closing Coordination',
      description: 'Confirm closing time and location with all parties',
      daysBeforeClosing: 1,
      priority: 'critical',
      category: 'closing'
    }
  ],
  Seller: [
    {
      title: 'Property Staging',
      description: 'Complete property staging for maximum appeal',
      daysBeforeClosing: 70,
      priority: 'high',
      category: 'marketing'
    },
    {
      title: 'Professional Photography',
      description: 'Schedule and conduct professional photography',
      daysBeforeClosing: 68,
      priority: 'high',
      category: 'marketing'
    },
    {
      title: 'Create Listing Brochure',
      description: 'Design and print listing brochures for showings',
      daysBeforeClosing: 65,
      priority: 'medium',
      category: 'marketing'
    },
    {
      title: 'MLS Upload',
      description: 'Upload listing to MLS with all details and photos',
      daysBeforeClosing: 64,
      priority: 'high',
      category: 'marketing'
    },
    {
      title: 'Marketing Campaign Launch',
      description: 'Launch email, social media, and direct mail campaigns',
      daysBeforeClosing: 63,
      priority: 'high',
      category: 'marketing'
    },
    {
      title: 'Open House Setup',
      description: 'Schedule and prepare for open house',
      daysBeforeClosing: 55,
      priority: 'medium',
      category: 'showings'
    },
    {
      title: 'Review Inspection Report',
      description: 'Review buyer\'s inspection report and plan response',
      daysBeforeClosing: 28,
      priority: 'high',
      category: 'inspection'
    },
    {
      title: 'Negotiate Repairs/Credits',
      description: 'Negotiate repair requests or credits with buyer',
      daysBeforeClosing: 25,
      priority: 'high',
      category: 'inspection'
    },
    {
      title: 'Obtain Title Documents',
      description: 'Gather all title documents and deeds for closing',
      daysBeforeClosing: 15,
      priority: 'high',
      category: 'legal'
    },
    {
      title: 'Final Walk-Through by Buyer',
      description: 'Coordinate final walkthrough for buyer verification',
      daysBeforeClosing: 3,
      priority: 'high',
      category: 'closing'
    },
    {
      title: 'Closing Coordination',
      description: 'Confirm closing details and arrange deed delivery',
      daysBeforeClosing: 1,
      priority: 'critical',
      category: 'closing'
    }
  ],
  Landlord: [
    {
      title: 'Tenant Screening',
      description: 'Run background check, credit check, and references',
      daysBeforeClosing: 30,
      priority: 'high',
      category: 'tenant'
    },
    {
      title: 'Lease Agreement Finalization',
      description: 'Prepare and finalize lease agreement',
      daysBeforeClosing: 7,
      priority: 'high',
      category: 'legal'
    },
    {
      title: 'Move-In Inspection',
      description: 'Conduct detailed move-in inspection with tenant',
      daysBeforeClosing: 1,
      priority: 'high',
      category: 'inspection'
    },
    {
      title: 'Keys Handoff',
      description: 'Hand over keys and provide property orientation',
      daysBeforeClosing: 0,
      priority: 'critical',
      category: 'closing'
    },
    {
      title: 'Utilities Setup Verification',
      description: 'Verify all utilities are activated and functioning',
      daysBeforeClosing: 0,
      priority: 'high',
      category: 'closing'
    }
  ],
  Tenant: [
    {
      title: 'Verify Property Availability',
      description: 'Confirm lease start date and property availability',
      daysBeforeClosing: 30,
      priority: 'high',
      category: 'lease'
    },
    {
      title: 'Review Lease Terms',
      description: 'Review lease agreement and understand all terms',
      daysBeforeClosing: 14,
      priority: 'high',
      category: 'legal'
    },
    {
      title: 'Arrange Moving Services',
      description: 'Book moving company or arrange moving logistics',
      daysBeforeClosing: 14,
      priority: 'medium',
      category: 'logistics'
    },
    {
      title: 'Utility Setup',
      description: 'Schedule utilities transfer/setup for move-in date',
      daysBeforeClosing: 7,
      priority: 'high',
      category: 'logistics'
    },
    {
      title: 'Final Lease Review',
      description: 'Final review of lease and sign agreement',
      daysBeforeClosing: 3,
      priority: 'critical',
      category: 'legal'
    },
    {
      title: 'Move-In Inspection',
      description: 'Walk through property with landlord and document condition',
      daysBeforeClosing: 0,
      priority: 'critical',
      category: 'inspection'
    },
    {
      title: 'Keys and Access',
      description: 'Receive keys and verify access to property',
      daysBeforeClosing: 0,
      priority: 'critical',
      category: 'closing'
    }
  ]
};

/**
 * Calculate task due date based on closing date and days before
 */
const calculateDueDate = (closingDate, daysBeforeClosing) => {
  const closing = new Date(closingDate);
  const dueDate = new Date(closing);
  dueDate.setDate(dueDate.getDate() - daysBeforeClosing);
  return dueDate.toISOString().split('T')[0]; // Return as YYYY-MM-DD
};

/**
 * Generate tasks for a transaction based on its type and closing date
 * @param {string} userId - The user ID
 * @param {string} transactionId - The transaction ID
 * @param {string} transactionType - Type: 'Buyer', 'Seller', 'Landlord', 'Tenant'
 * @param {string} closingDate - The closing date in ISO format or YYYY-MM-DD
 * @returns {Promise<array>} - Array of created task IDs
 */
export const generateTasksForTransaction = async (userId, transactionId, transactionType, closingDate) => {
  try {
    const templates = taskTemplates[transactionType] || [];
    const createdTaskIds = [];

    for (const template of templates) {
      const dueDate = calculateDueDate(closingDate, template.daysBeforeClosing);

      const newTask = {
        ...template,
        transactionId,
        dueDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignee: userId, // Default to transaction creator
        completedAt: null,
        notes: ''
      };

      const tasksRef = ref(database, `users/${userId}/tasks`);
      const newTaskRef = await push(tasksRef, newTask);
      createdTaskIds.push(newTaskRef.key);

      console.log(`Task created: ${template.title} (due: ${dueDate})`);
    }

    return createdTaskIds;
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw error;
  }
};

/**
 * Get all tasks for a user
 * @param {string} userId - The user ID
 * @returns {Promise<array>} - Array of tasks with IDs
 */
export const getTasks = async (userId) => {
  try {
    const tasksRef = ref(database, `users/${userId}/tasks`);
    const snapshot = await get(tasksRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(id => ({
        id,
        ...data[id]
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Get tasks for a specific transaction
 * @param {string} userId - The user ID
 * @param {string} transactionId - The transaction ID
 * @returns {Promise<array>} - Array of tasks for the transaction
 */
export const getTasksByTransaction = async (userId, transactionId) => {
  try {
    const allTasks = await getTasks(userId);
    return allTasks.filter(task => task.transactionId === transactionId);
  } catch (error) {
    console.error('Error fetching tasks by transaction:', error);
    throw error;
  }
};

/**
 * Get tasks by status (pending, in-progress, completed)
 * @param {string} userId - The user ID
 * @param {string} status - Task status
 * @returns {Promise<array>} - Array of tasks with given status
 */
export const getTasksByStatus = async (userId, status) => {
  try {
    const allTasks = await getTasks(userId);
    return allTasks.filter(task => task.status === status);
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    throw error;
  }
};

/**
 * Get overdue tasks
 * @param {string} userId - The user ID
 * @returns {Promise<array>} - Array of overdue tasks
 */
export const getOverdueTasks = async (userId) => {
  try {
    const allTasks = await getTasks(userId);
    const today = new Date().toISOString().split('T')[0];
    return allTasks.filter(task =>
      task.status !== 'completed' && task.dueDate < today
    );
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    throw error;
  }
};

/**
 * Update a task
 * @param {string} userId - The user ID
 * @param {string} taskId - The task ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateTask = async (userId, taskId, updates) => {
  try {
    const taskRef = ref(database, `users/${userId}/tasks/${taskId}`);

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (updates.status === 'completed' && !updates.completedAt) {
      updatedData.completedAt = new Date().toISOString();
    }

    await update(taskRef, updatedData);
    console.log('Task updated:', taskId);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} userId - The user ID
 * @param {string} taskId - The task ID
 * @returns {Promise<void>}
 */
export const deleteTask = async (userId, taskId) => {
  try {
    const taskRef = ref(database, `users/${userId}/tasks/${taskId}`);

    await remove(taskRef);
    console.log('Task deleted:', taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

/**
 * Get tasks due in the next N days
 * @param {string} userId - The user ID
 * @param {number} days - Number of days to look ahead
 * @returns {Promise<array>} - Array of upcoming tasks
 */
export const getUpcomingTasks = async (userId, days = 7) => {
  try {
    const allTasks = await getTasks(userId);
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + days);

    const todayStr = today.toISOString().split('T')[0];
    const futureStr = futureDate.toISOString().split('T')[0];

    return allTasks.filter(task =>
      task.status !== 'completed' &&
      task.dueDate >= todayStr &&
      task.dueDate <= futureStr
    );
  } catch (error) {
    console.error('Error fetching upcoming tasks:', error);
    throw error;
  }
};

/**
 * Get tasks by priority
 * @param {string} userId - The user ID
 * @param {string} priority - Priority level: 'critical', 'high', 'medium', 'low'
 * @returns {Promise<array>} - Array of tasks with given priority
 */
export const getTasksByPriority = async (userId, priority) => {
  try {
    const allTasks = await getTasks(userId);
    return allTasks.filter(task => task.priority === priority);
  } catch (error) {
    console.error('Error fetching tasks by priority:', error);
    throw error;
  }
};
