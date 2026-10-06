import { ref, push, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebaseConfig';
// import db - removed

/**
 * Notification service for managing email, SMS, and in-app notifications
 */

// Email Templates
export const emailTemplates = {
  taskReminder24h: {
    id: 'task_reminder_24h',
    subject: 'Task Reminder: {taskTitle} Due Tomorrow',
    body: `
Hello {firstName},

This is a friendly reminder that the following task is due tomorrow:

Task: {taskTitle}
Description: {taskDescription}
Due Date: {dueDate}
Priority: {priority}
Transaction: {transactionName}

Please log in to your account to review and complete this task.

Transaction Link: {transactionLink}
Task Link: {tasksLink}

Best regards,
RESIDENCE | eXp Realty Team
    `
  },
  taskReminder1h: {
    id: 'task_reminder_1h',
    subject: 'URGENT: {taskTitle} Due in 1 Hour',
    body: `
Hello {firstName},

URGENT: The following task is due in 1 hour:

Task: {taskTitle}
Description: {taskDescription}
Due Date: {dueDate} (TODAY)
Priority: {priority}
Transaction: {transactionName}

Please complete this task immediately.

Task Link: {tasksLink}

RESIDENCE | eXp Realty Team
    `
  },
  taskOverdue: {
    id: 'task_overdue',
    subject: 'OVERDUE: {taskTitle}',
    body: `
Hello {firstName},

This task is now OVERDUE:

Task: {taskTitle}
Description: {taskDescription}
Due Date: {dueDate}
Days Overdue: {daysOverdue}
Priority: {priority}
Transaction: {transactionName}

Please prioritize completing this task immediately.

Task Link: {tasksLink}

Contact your agent if you need assistance.

RESIDENCE | eXp Realty Team
    `
  },
  closingApproaching7d: {
    id: 'closing_approaching_7d',
    subject: 'Important: Your Closing is in 7 Days',
    body: `
Hello {firstName},

Your closing is scheduled in 7 days!

Property: {propertyAddress}
Closing Date: {closingDate}
Days Until Closing: 7

Please ensure all outstanding tasks are completed:
- {incompleteTaskCount} tasks remaining
- Review all required documents
- Confirm wire transfer details
- Schedule final walkthrough

Log in to view your complete task list and transaction details.

Dashboard: {dashboardLink}
Tasks: {tasksLink}

If you have any questions, please contact your agent:
{agentName}: {agentPhone} | {agentEmail}

RESIDENCE | eXp Realty Team
    `
  },
  closingApproaching3d: {
    id: 'closing_approaching_3d',
    subject: 'FINAL REMINDER: Your Closing is in 3 Days',
    body: `
Hello {firstName},

FINAL REMINDER: Your closing is scheduled in just 3 days!

Property: {propertyAddress}
Closing Date: {closingDate}
Closing Time: {closingTime}
Closing Location: {closingLocation}

CRITICAL ITEMS TO COMPLETE:
- Confirm all required documents are signed
- Verify wire transfer instructions
- Confirm final walkthrough time
- Review closing disclosure
- Ensure homeowner's insurance is in place

REMAINING TASKS: {incompleteTaskCount}

Contact your agent IMMEDIATELY if any issues arise:
{agentName}: {agentPhone} | {agentEmail}

Tasks: {tasksLink}

See you at closing!
RESIDENCE | eXp Realty Team
    `
  },
  transactionCreated: {
    id: 'transaction_created',
    subject: 'Welcome! Your {type} Transaction Has Been Created',
    body: `
Hello {firstName},

Your {type} transaction has been successfully created in the RESIDENCE system.

Property: {propertyAddress}
Transaction Type: {type}
Created Date: {createdDate}

Associated tasks have been automatically generated based on your closing/lease start date:
- Total Tasks: {totalTasks}
- Pending: {pendingTasks}
- Priority Levels: Critical, High, Medium, Low

Next Steps:
1. Review your transaction details
2. Monitor your task list for deadline-driven activities
3. Contact your agent with any questions

View Your Transaction: {transactionLink}
View Your Tasks: {tasksLink}

Questions? Contact us anytime:
Kelly Olin: 239-488-5900 | Kelly.Olin@eXpRealty.com

RESIDENCE | eXp Realty Team
    `
  }
};

// SMS Templates
export const smsTemplates = {
  taskReminder24h: {
    id: 'sms_task_reminder_24h',
    message: `RESIDENCE: Reminder - {taskTitle} due tomorrow. Log in to complete. {tasksLink}`
  },
  taskReminder1h: {
    id: 'sms_task_reminder_1h',
    message: `URGENT - RESIDENCE: {taskTitle} due in 1 HOUR. Complete now: {tasksLink}`
  },
  taskOverdue: {
    id: 'sms_task_overdue',
    message: `OVERDUE - RESIDENCE: {taskTitle} is overdue. Complete immediately: {tasksLink}`
  },
  closingApproaching7d: {
    id: 'sms_closing_7d',
    message: `RESIDENCE: Your closing for {propertyAddress} is in 7 days ({closingDate}). {incompleteTaskCount} tasks remaining. Review here: {tasksLink}`
  },
  closingApproaching3d: {
    id: 'sms_closing_3d',
    message: `URGENT - RESIDENCE: Closing in 3 DAYS! Property: {propertyAddress}. Date: {closingDate}. {incompleteTaskCount} tasks pending. Action needed: {tasksLink}`
  },
  closingTomorrow: {
    id: 'sms_closing_tomorrow',
    message: `CLOSING TOMORROW - RESIDENCE: {propertyAddress} closes {closingDate}. See you at {closingTime}! Call Kelly: 239-488-5900`
  }
};

/**
 * Create a notification record in Firebase
 * @param {string} userId - The user ID
 * @param {object} notification - Notification object with type, title, body, status
 * @returns {Promise<string>} - Notification ID
 */
export const createNotification = async (userId, notification) => {
  try {
    const notificationsRef = ref(database, `users/${userId}/notifications`);

    const newNotification = {
      ...notification,
      createdAt: new Date().toISOString(),
      read: false,
      status: 'pending' // pending, sent, failed
    };

    const newNotifRef = await push(notificationsRef, newNotification);
    console.log('Notification created:', newNotifRef.key);
    return newNotifRef.key;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get all notifications for a user
 * @param {string} userId - The user ID
 * @returns {Promise<array>} - Array of notifications
 */
export const getNotifications = async (userId) => {
  try {
    const notificationsRef = ref(database, `users/${userId}/notifications`);
    const snapshot = await get(notificationsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(id => ({
        id,
        ...data[id]
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Get unread notifications for a user
 * @param {string} userId - The user ID
 * @returns {Promise<array>} - Array of unread notifications
 */
export const getUnreadNotifications = async (userId) => {
  try {
    const allNotifications = await getNotifications(userId);
    return allNotifications.filter(n => !n.read);
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} userId - The user ID
 * @param {string} notificationId - The notification ID
 * @returns {Promise<void>}
 */
export const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const notifRef = ref(database, `users/${userId}/notifications/${notificationId}`);

    await update(notifRef, {
      read: true,
      readAt: new Date().toISOString()
    });
    console.log('Notification marked as read:', notificationId);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 * @param {string} userId - The user ID
 * @param {string} notificationId - The notification ID
 * @returns {Promise<void>}
 */
export const deleteNotification = async (userId, notificationId) => {
  try {
    const notifRef = ref(database, `users/${userId}/notifications/${notificationId}`);

    await remove(notifRef);
    console.log('Notification deleted:', notificationId);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Get notification preference for a user
 * @param {string} userId - The user ID
 * @returns {Promise<object>} - Notification preferences
 */
export const getNotificationPreferences = async (userId) => {
  try {
    const prefsRef = ref(database, `users/${userId}/notificationPreferences`);
    const snapshot = await get(prefsRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    // Return default preferences
    return {
      emailNotifications: true,
      smsNotifications: true,
      inAppNotifications: true,
      taskReminder24h: true,
      taskReminder1h: true,
      taskOverdue: true,
      closingReminders: true,
      transactionUpdates: true
    };
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};

/**
 * Update notification preferences for a user
 * @param {string} userId - The user ID
 * @param {object} preferences - Preference object
 * @returns {Promise<void>}
 */
export const updateNotificationPreferences = async (userId, preferences) => {
  try {
    const prefsRef = ref(database, `users/${userId}/notificationPreferences`);

    const updatedPrefs = {
      ...preferences,
      updatedAt: new Date().toISOString()
    };

    await set(prefsRef, updatedPrefs);
    console.log('Notification preferences updated');
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

/**
 * Format a template with data
 * @param {string} template - Template string with {placeholders}
 * @param {object} data - Data object to fill placeholders
 * @returns {string} - Formatted string
 */
export const formatTemplate = (template, data) => {
  let result = template;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, data[key] || '');
  });
  return result;
};

/**
 * Send email notification (mock for now - integrate with email service)
 * @param {string} email - Recipient email
 * @param {string} templateId - Template ID
 * @param {object} data - Template data
 * @returns {Promise<object>} - Result object
 */
export const sendEmailNotification = async (email, templateId, data) => {
  try {
    const template = emailTemplates[templateId];
    if (!template) throw new Error(`Email template not found: ${templateId}`);

    const subject = formatTemplate(template.subject, data);
    const body = formatTemplate(template.body, data);

    // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
    console.log(`[EMAIL] Sending to ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    return {
      success: true,
      type: 'email',
      recipient: email,
      templateId,
      sentAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send SMS notification (mock for now - integrate with SMS service)
 * @param {string} phone - Recipient phone number
 * @param {string} templateId - Template ID
 * @param {object} data - Template data
 * @returns {Promise<object>} - Result object
 */
export const sendSmsNotification = async (phone, templateId, data) => {
  try {
    const template = smsTemplates[templateId];
    if (!template) throw new Error(`SMS template not found: ${templateId}`);

    const message = formatTemplate(template.message, data);

    // TODO: Integrate with SMS service (Twilio, etc.)
    console.log(`[SMS] Sending to ${phone}`);
    console.log(`Message: ${message}`);

    return {
      success: true,
      type: 'sms',
      recipient: phone,
      templateId,
      sentAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

/**
 * Create and log notification trigger event
 * @param {string} userId - The user ID
 * @param {string} type - Notification type (task_reminder, closing_reminder, etc.)
 * @param {object} data - Notification data
 * @returns {Promise<void>}
 */
export const logNotificationTrigger = async (userId, type, data) => {
  try {
    const logsRef = ref(database, `users/${userId}/notificationLogs`);

    const logEntry = {
      type,
      data,
      triggeredAt: new Date().toISOString(),
      status: 'pending'
    };

    await push(logsRef, logEntry);
    console.log(`Notification trigger logged: ${type}`);
  } catch (error) {
    console.error('Error logging notification trigger:', error);
    // Don't throw - logging failures shouldn't break the app
  }
};

export default {
  emailTemplates,
  smsTemplates,
  createNotification,
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences,
  formatTemplate,
  sendEmailNotification,
  sendSmsNotification,
  logNotificationTrigger
};
