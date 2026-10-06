import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Bell, Trash2, Check, AlertCircle, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationAsRead, deleteNotification } from '../services/notificationService';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterView, setFilterView] = useState('all'); // all, unread, read

  useEffect(() => {
    loadNotifications();
  }, [user?.uid]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      if (user?.uid) {
        const notifs = await getNotifications(user.uid);
        // Sort by created date, newest first
        notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(notifs);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId, isRead) => {
    try {
      if (!isRead) {
        await markNotificationAsRead(user.uid, notificationId);
        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId
              ? { ...n, read: true, readAt: new Date().toISOString() }
              : n
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(user.uid, notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getFilteredNotifications = () => {
    switch (filterView) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'read':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    if (type?.includes('urgent') || type?.includes('overdue') || type?.includes('1h')) {
      return <AlertCircle size={20} style={{ color: '#d32f2f' }} />;
    }
    return <Bell size={20} style={{ color: '#D4AF37' }} />;
  };

  const getNotificationColor = (type) => {
    if (type?.includes('urgent') || type?.includes('overdue') || type?.includes('1h')) {
      return '#3a1a1a'; // Dark red tint
    }
    return '#1a1a1a';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', meridiem: 'short' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

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
        <h1 style={styles.title}>Notifications</h1>
        {unreadCount > 0 && (
          <div style={styles.badge}>{unreadCount}</div>
        )}
        <button
          onClick={() => navigate('/notification-preferences')}
          style={styles.settingsButton}
          title="Notification Preferences"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterBar}>
        <button
          onClick={() => setFilterView('all')}
          style={{
            ...styles.filterTab,
            ...(filterView === 'all' ? styles.filterTabActive : {})
          }}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterView('unread')}
          style={{
            ...styles.filterTab,
            ...(filterView === 'unread' ? styles.filterTabActive : {})
          }}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilterView('read')}
          style={{
            ...styles.filterTab,
            ...(filterView === 'read' ? styles.filterTabActive : {})
          }}
        >
          Read ({notifications.filter(n => n.read).length})
        </button>
      </div>

      {/* Content */}
      <div style={styles.mainContent}>
        {loading ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyStateText}>Loading notifications...</p>
          </div>
        ) : error ? (
          <div style={styles.errorBox}>
            <AlertCircle size={24} style={{ color: '#d32f2f' }} />
            <p style={styles.errorText}>{error}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={styles.emptyState}>
            <Bell size={48} style={{ color: '#666666', marginBottom: '16px' }} />
            <p style={styles.emptyStateText}>
              {filterView === 'all' && 'No notifications yet'}
              {filterView === 'unread' && 'All caught up!'}
              {filterView === 'read' && 'No read notifications'}
            </p>
            <p style={styles.emptyStateSubtext}>
              Notifications will appear here when you have tasks due or transactions are updated.
            </p>
          </div>
        ) : (
          <div style={styles.notificationsList}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  ...styles.notificationCard,
                  backgroundColor: notification.read
                    ? '#1a1a1a'
                    : getNotificationColor(notification.type),
                  borderLeft: notification.read
                    ? '4px solid #333333'
                    : '4px solid #D4AF37'
                }}
              >
                <div style={styles.notificationContent}>
                  <div style={styles.notificationHeader}>
                    <div style={styles.notificationIconWrapper}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div style={styles.notificationText}>
                      <h3 style={styles.notificationTitle}>{notification.title}</h3>
                      <p style={styles.notificationBody}>{notification.body}</p>
                      <p style={styles.notificationTime}>
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div style={styles.notificationActions}>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id, notification.read)}
                        style={styles.actionButton}
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      style={styles.actionButton}
                      title="Delete notification"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
    gap: '16px',
    position: 'relative'
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
    ':hover': {
      backgroundColor: '#333333'
    }
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
    flex: 1
  },
  settingsButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#D4AF37',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    marginLeft: 'auto'
  },
  badge: {
    backgroundColor: '#d32f2f',
    color: '#FFFFFF',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600'
  },
  filterBar: {
    backgroundColor: '#0a0a0a',
    borderBottom: '1px solid #333333',
    padding: '16px 40px',
    display: 'flex',
    gap: '8px'
  },
  filterTab: {
    backgroundColor: 'transparent',
    border: '1px solid #333333',
    color: '#999999',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  filterTabActive: {
    backgroundColor: '#D4AF37',
    color: '#000000',
    borderColor: '#D4AF37'
  },
  mainContent: {
    padding: '24px 40px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  notificationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  notificationCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '16px',
    transition: 'all 0.3s ease'
  },
  notificationContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px'
  },
  notificationHeader: {
    display: 'flex',
    gap: '12px',
    flex: 1
  },
  notificationIconWrapper: {
    minWidth: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationText: {
    flex: 1
  },
  notificationTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#FFFFFF'
  },
  notificationBody: {
    fontSize: '14px',
    color: '#CCCCCC',
    margin: '0 0 8px 0'
  },
  notificationTime: {
    fontSize: '12px',
    color: '#999999',
    margin: '0'
  },
  notificationActions: {
    display: 'flex',
    gap: '8px',
    minWidth: 'fit-content'
  },
  actionButton: {
    backgroundColor: '#333333',
    border: 'none',
    color: '#D4AF37',
    width: '36px',
    height: '36px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center'
  },
  emptyStateText: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#FFFFFF',
    margin: '0'
  },
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#999999',
    margin: '8px 0 0 0'
  },
  errorBox: {
    backgroundColor: '#3a1a1a',
    border: '1px solid #d32f2f',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  errorText: {
    fontSize: '14px',
    color: '#FFFFFF',
    margin: '4px 0 0 0'
  }
};
