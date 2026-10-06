// Notification trigger service - stub implementation
// Most functions disabled due to missing dependencies on authService and notificationService

export const sendTransactionCreatedNotification = async (userId, transaction) => {
  return;
};

export const checkTaskReminders24h = async (userId) => {
  return [];
};

export const checkTaskReminders1h = async (userId) => {
  return [];
};

export const checkOverdueTasks = async (userId) => {
  return [];
};

export const checkClosingApproaching7d = async (userId) => {
  return [];
};

export const checkClosingApproaching3d = async (userId) => {
  return [];
};

export const runNotificationChecks = async (userId) => {
  try {
    console.log(`Running notification checks for user: ${userId}`);
    return {
      reminders24h: [],
      reminders1h: [],
      overdue: [],
      closing7d: [],
      closing3d: [],
      totalSent: 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error running notification checks:', error);
    throw error;
  }
};
