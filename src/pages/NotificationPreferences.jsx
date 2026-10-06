import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { getNotificationPreferences, updateNotificationPreferences } from '../services/notificationService';

export default function NotificationPreferences() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    inAppNotifications: true,
    taskReminder24h: true,
    taskReminder1h: true,
    taskOverdue: true,
    closingReminders: true,
    transactionUpdates: true
  });

  useEffect(() => {
    loadPreferences();
  }, [user?.uid]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      if (user?.uid) {
        const prefs = await getNotificationPreferences(user.uid);
        setPreferences(prefs);
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    setSuccess(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      if (user?.uid) {
        await updateNotificationPreferences(user.uid, preferences);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button
            onClick={() => navigate('/dashboard')}
            style={styles.backButton}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={styles.title}>Notification Preferences</h1>
        </div>
        <div style={styles.loadingMessage}>
          <p>Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate('/dashboard')}
          style={styles.backButton}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={styles.title}>Notification Preferences</h1>
      </div>

      {/* Content */}
      <div style={styles.mainContent}>
        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={20} style={{ color: '#d32f2f' }} />
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {success && (
          <div style={styles.successBox}>
            <p style={styles.successText}>Preferences saved successfully!</p>
          </div>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Notification Channels</h2>
          <p style={styles.sectionDescription}>
            Choose which channels you want to receive notifications through
          </p>

          <div style={styles.preferenceGroup}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                style={styles.checkbox}
              />
              <div style={styles.labelContent}>
                <div style={styles.labelTitle}>Email Notifications</div>
                <div style={styles.labelDescription}>
                  Receive notifications via email to {user?.email}
                </div>
              </div>
            </label>
          </div>

          <div style={styles.preferenceGroup}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
                style={styles.checkbox}
              />
              <div style={styles.labelContent}>
                <div style={styles.labelTitle}>SMS Notifications</div>
                <div style={styles.labelDescription}>
                  Receive text message reminders about tasks and closing dates
                </div>
              </div>
            </label>
          </div>

          <div style={styles.preferenceGroup}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                checked={preferences.inAppNotifications}
                onChange={() => handleToggle('inAppNotifications')}
                style={styles.checkbox}
              />
              <div style={styles.labelContent}>
                <div style={styles.labelTitle}>In-App Notifications</div>
                <div style={styles.labelDescription}>
                  See notifications when logged into the app
                </div>
              </div>
            </label>
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Notification Types</h2>
          <p style={styles.sectionDescription}>
            Choose which types of notifications you want to receive
          </p>

          <div style={styles.preferenceGroup}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                checked={preferences.taskReminder24h}
                onChange={() => handleToggle('taskReminder24h')}
                style={styles.checkbox}
              />
              <div style={styles.labelContent}>
                <div style={styles.labelTitle}>24-Hour Task Reminders</div>
                <div style={styles.labelDescription}>
                  Get reminded when tasks are due tomorrow
                </div>
              </div>
            </label>
          </div>

          <div style={styles.preferenceGroup}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                checked={preferences.taskReminder1h}
                onChange={() => handleToggle('taskReminder1h')}
                style={styles.checkbox}
              />
              <div style={styles.labelContent}>
                <div style={styles.labelTitle}>1-Hour Task Reminders</div>
                <div style={styles.labelDescription}>
                  Get urgent reminders when tasks are due in 1 hour
                </div>
              </div>
            </label>
          </div>

          <div style={styles.preferenceGroup}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                checked={preferences.taskOverdue}
                onChange={() => handleToggle('taskOverdue')}
                style={styles.checkbox}
              />
              <div style={styles.labelContent}>
                <div style={styles.labelTitle}>Overdue Task Alerts</div>
                <div style={styles.labelDescription}>
                  Get notified about tasks that are overdue
                </div>
              </div>
            </label>
          </div>

          <div style={styles.preferenceGroup}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                checked={preferences.closingReminders}
                onChange={() => handleToggle('closingReminders')}
                style={styles.checkbox}
              />
              <div style={styles.labelContent}>
                <div style={styles.labelTitle}>Closing Reminders</div>
                <div style={styles.labelDescription}>
                  Get reminders when closing dates are approaching (7 and 3 days out)
                </div>
              </div>
            </label>
          </div>

          <div style={styles.preferenceGroup}>
            <label style={styles.preferenceLabel}>
              <input
                type="checkbox"
                checked={preferences.transactionUpdates}
                onChange={() => handleToggle('transactionUpdates')}
                style={styles.checkbox}
              />
              <div style={styles.labelContent}>
                <div style={styles.labelTitle}>Transaction Updates</div>
                <div style={styles.labelDescription}>
                  Get notified when new transactions are created
                </div>
              </div>
            </label>
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.actions}>
          <button
            onClick={() => navigate('/dashboard')}
            style={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={styles.saveButton}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  header: {
    backgroundColor: '#1a1a1a',
    borderBottom: '2px solid #D4AF37',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#D4AF37',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
    flex: 1
  },
  mainContent: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '40px'
  },
  loadingMessage: {
    padding: '40px',
    textAlign: 'center',
    color: '#999999'
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#FFFFFF'
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#999999',
    margin: '0 0 20px 0'
  },
  preferenceGroup: {
    marginBottom: '16px'
  },
  preferenceLabel: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    alignItems: 'flex-start'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    marginTop: '2px',
    cursor: 'pointer',
    accentColor: '#D4AF37'
  },
  labelContent: {
    flex: 1
  },
  labelTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: '4px'
  },
  labelDescription: {
    fontSize: '13px',
    color: '#999999'
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #333333',
    margin: '32px 0',
    backgroundColor: 'transparent'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    backgroundColor: 'transparent',
    border: '1px solid #333333',
    color: '#D4AF37',
    padding: '12px 24px',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  saveButton: {
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    ':disabled': {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  },
  errorBox: {
    backgroundColor: '#3a1a1a',
    border: '1px solid #d32f2f',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  errorText: {
    fontSize: '14px',
    color: '#FFFFFF',
    margin: '0'
  },
  successBox: {
    backgroundColor: '#1a3a1a',
    border: '1px solid #4CAF50',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px'
  },
  successText: {
    fontSize: '14px',
    color: '#4CAF50',
    margin: '0',
    fontWeight: '500'
  }
};
