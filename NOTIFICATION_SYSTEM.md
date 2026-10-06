# RESIDENCE Notification System Documentation

## Overview

The RESIDENCE notification system provides automated email, SMS, and in-app notifications for real estate transaction management. It tracks task deadlines and closing dates, automatically sending reminders at critical times to keep clients and team members informed and on track.

## Architecture

### Core Services

#### 1. **notificationService.js**
The foundation service that handles notification storage, preferences, and email/SMS template definitions.

**Key Functions:**
- `createNotification(userId, notification)` - Create in-app notification records
- `getNotifications(userId)` - Retrieve all notifications for a user
- `getUnreadNotifications(userId)` - Get unread notifications only
- `markNotificationAsRead(userId, notificationId)` - Mark notification as read
- `deleteNotification(userId, notificationId)` - Delete a notification
- `getNotificationPreferences(userId)` - Retrieve user preferences (defaults if none exist)
- `updateNotificationPreferences(userId, preferences)` - Update user preferences
- `formatTemplate(template, data)` - Replace {placeholder} values with data
- `sendEmailNotification(email, templateId, data)` - Send email (stub for integration)
- `sendSmsNotification(phone, templateId, data)` - Send SMS (stub for integration)
- `logNotificationTrigger(userId, type, data)` - Log trigger events for auditing

**Email Templates Included:**
- `taskReminder24h` - Task due tomorrow reminder
- `taskReminder1h` - Urgent task due in 1 hour reminder
- `taskOverdue` - Task is overdue alert
- `closingApproaching7d` - Closing in 7 days notification
- `closingApproaching3d` - Final 3-day closing reminder
- `transactionCreated` - New transaction created notification

**SMS Templates Included:**
- `taskReminder24h` - Short 24-hour reminder
- `taskReminder1h` - Urgent 1-hour reminder
- `taskOverdue` - Overdue task alert
- `closingApproaching7d` - 7-day closing reminder
- `closingApproaching3d` - 3-day closing reminder
- `closingTomorrow` - Closing tomorrow reminder

#### 2. **notificationTriggerService.js**
Monitors tasks and transactions, automatically triggering notifications based on configurable rules.

**Key Functions:**
- `checkTaskReminders24h(userId)` - Check for tasks due within 24 hours
- `checkTaskReminders1h(userId)` - Check for tasks due within 1 hour
- `checkOverdueTasks(userId)` - Identify and notify about overdue tasks
- `checkClosingApproaching7d(userId)` - Check for closings in 7 days
- `checkClosingApproaching3d(userId)` - Check for closings in 3 days
- `sendTransactionCreatedNotification(userId, transaction)` - Send notification on transaction creation
- `runNotificationChecks(userId)` - Execute all checks and return summary

**Trigger Rules:**
- 24-hour reminders: Tasks with `status != 'completed'` and due in 24 hours
- 1-hour reminders: Urgent alerts for tasks due within 1 hour
- Overdue alerts: Tasks past their due date
- Closing reminders: Transactions approaching closing/lease start dates
- Transaction created: All new transactions generate notification with task summary

### Pages

#### 3. **NotificationsPage.jsx**
User-facing interface for viewing and managing notifications.

**Features:**
- View all notifications with titles, descriptions, and timestamps
- Filter by view (all, unread, read)
- Mark individual notifications as read
- Delete notifications
- Real-time status counts (total, unread, read)
- Responsive design with dark theme
- Quick access to preferences via Settings button
- Relative date formatting (Today, Yesterday, specific date)

#### 4. **NotificationPreferences.jsx**
Settings page for users to control notification delivery preferences.

**Configurable Options:**
- **Channels:**
  - Email Notifications
  - SMS Notifications
  - In-App Notifications

- **Notification Types:**
  - 24-Hour Task Reminders
  - 1-Hour Task Reminders
  - Overdue Task Alerts
  - Closing Reminders
  - Transaction Updates

All preferences are stored in Firebase per user and returned with defaults if not yet configured.

## Database Structure

```
users/{userId}/
├── notifications/
│   └── {notificationId}/
│       ├── type: string
│       ├── title: string
│       ├── body: string
│       ├── taskId: string (optional)
│       ├── transactionId: string (optional)
│       ├── urgent: boolean
│       ├── read: boolean
│       ├── readAt: ISO timestamp
│       ├── createdAt: ISO timestamp
│       └── status: 'pending'|'sent'|'failed'
│
├── notificationPreferences/
│   ├── emailNotifications: boolean
│   ├── smsNotifications: boolean
│   ├── inAppNotifications: boolean
│   ├── taskReminder24h: boolean
│   ├── taskReminder1h: boolean
│   ├── taskOverdue: boolean
│   ├── closingReminders: boolean
│   ├── transactionUpdates: boolean
│   └── updatedAt: ISO timestamp
│
└── notificationLogs/
    └── {logId}/
        ├── type: string
        ├── data: object
        ├── triggeredAt: ISO timestamp
        └── status: 'pending'
```

## Integration Points

### Email Service Integration
Currently `sendEmailNotification()` is a mock that logs to console. To integrate with a real service:

**Recommended Services:**
- SendGrid
- Mailgun
- AWS SES
- Twilio SendGrid

**Implementation Example (SendGrid):**
```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmailNotification = async (email, templateId, data) => {
  const template = emailTemplates[templateId];
  const subject = formatTemplate(template.subject, data);
  const body = formatTemplate(template.body, data);

  await sgMail.send({
    to: email,
    from: 'notifications@residence.com',
    subject: subject,
    html: formatHTMLBody(body),
    replyTo: 'Kelly.Olin@eXpRealty.com',
  });
};
```

### SMS Service Integration
Currently `sendSmsNotification()` is a mock. To integrate:

**Recommended Services:**
- Twilio
- AWS SNS
- Telnyx

**Implementation Example (Twilio):**
```javascript
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSmsNotification = async (phone, templateId, data) => {
  const template = smsTemplates[templateId];
  const message = formatTemplate(template.message, data);

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
};
```

## Notification Flow

### On Transaction Creation
1. User creates new transaction (Buyer/Seller/Landlord/Tenant form)
2. `createTransaction()` saves transaction to Firebase
3. `generateTasksForTransaction()` creates deadline-based tasks
4. `sendTransactionCreatedNotification()` triggers:
   - Creates in-app notification
   - Sends email if user has preference enabled
   - Sends SMS if user has preference enabled
   - Logs trigger event for auditing

### Scheduled Checks (To Be Implemented)
A background job (Cloud Function or external scheduler) should run periodically:
```javascript
// Run every 15 minutes
const results = await runNotificationChecks(userId);
// Returns count of notifications sent for each trigger type
```

### Task Update Workflow
When a task is marked complete:
1. Task status updates in Firebase
2. Task is excluded from future reminder checks
3. Existing pending notifications remain visible to user

## Email Template Examples

### taskReminder24h
**Subject:** Task Reminder: {taskTitle} Due Tomorrow

Body includes:
- Greeting
- Task details (title, description, due date, priority)
- Transaction name
- Links to transaction and tasks page
- Agent contact info (Kelly Olin)

### closingApproaching3d
**Subject:** FINAL REMINDER: Your Closing is in 3 Days

Body includes:
- Urgent language
- Property address & closing details
- Critical items checklist
- Incomplete task count
- Agent contact info with emphasis on immediate action

## Frontend Components

### Navigation Updates
- Dashboard now links to `/notifications` instead of "Coming Soon"
- Notifications page accessible from main dashboard
- Settings button in notifications header links to preferences
- Mobile responsive design

### Styling
- Dark theme (#000000 background, #D4AF37 gold accents)
- Unread notifications highlighted with gold border
- Urgent notifications (1h, overdue) show red icon
- Filter tabs for easy navigation
- Action buttons for mark-as-read and delete

## User Preferences Defaults

When a user first accesses notifications:
```javascript
{
  emailNotifications: true,
  smsNotifications: true,
  inAppNotifications: true,
  taskReminder24h: true,
  taskReminder1h: true,
  taskOverdue: true,
  closingReminders: true,
  transactionUpdates: true
}
```

All users can modify these preferences on the NotificationPreferences page.

## Duplicate Prevention

The `hasNotificationBeenSentToday()` function prevents duplicate notifications for the same trigger on the same day. This is checked before sending notifications to avoid spamming users.

## Next Steps

1. **Integrate Email Service**
   - Choose provider (SendGrid recommended for template support)
   - Add API key to environment variables
   - Update `sendEmailNotification()` function
   - Test with sample transactions

2. **Integrate SMS Service**
   - Choose provider (Twilio recommended)
   - Add credentials to environment variables
   - Update `sendSmsNotification()` function
   - Test phone number formatting for various countries

3. **Implement Background Jobs**
   - Firebase Cloud Functions for scheduled notification checks
   - Run `runNotificationChecks()` every 15 minutes for each active user
   - Alternative: External service (AWS Lambda, Heroku scheduler)

4. **Add Notification Delivery Status UI**
   - Show which notifications were successfully sent
   - Display delivery failures and retry options
   - Analytics dashboard for notification effectiveness

5. **Enhance Templates**
   - Make HTML email formatting more sophisticated
   - Add branding/logos to emails
   - Test email rendering across clients
   - Add unsubscribe links for compliance

6. **Extended Features**
   - Push notifications for mobile app
   - Notification digest (daily/weekly summary)
   - Customizable reminder times (e.g., 2 days before vs 24 hours)
   - Notification history/archive
   - Bulk notification management

## Testing

To test the notification system:

1. **Create a test transaction** with a closing date tomorrow
2. **Verify in-app notification** appears on Notifications page
3. **Check preferences** are saved/loaded correctly
4. **Mark as read** and verify UI updates
5. **Delete notification** and verify removal
6. **Change preferences** and verify toggle behavior
7. **Check console logs** for mock email/SMS output

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No notifications appearing | Check user preferences aren't disabled; verify transaction has valid dates |
| Duplicate notifications | Check `hasNotificationBeenSentToday()` logic; review notification logs |
| Email/SMS not sending | Implement and test actual service integration; check API credentials |
| Preferences not saving | Verify Firebase write permissions; check browser console for errors |
| Notifications not loading | Check Firebase database permissions; verify user authentication |

## API Dependencies

- Firebase Realtime Database (existing)
- Firebase Authentication (existing)
- Lucide React Icons (for UI)
- React Router v6 (for navigation)

## Performance Considerations

- Notification checks should be throttled (run max once per 15 minutes per user)
- Use Firebase indexes for efficient query performance
- Consider archiving old notifications to avoid large datasets
- Batch notification checks for multiple users in scheduled jobs
- Cache user preferences to reduce database reads
