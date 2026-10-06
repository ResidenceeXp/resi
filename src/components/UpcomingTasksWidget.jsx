import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUpcomingTasks, updateTask } from '../services/taskService';
import { getTransaction } from '../services/transactionService';
import { Clock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UpcomingTasksWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [transactionNames, setTransactionNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    loadUpcomingTasks();
  }, [user?.uid]);

  const loadUpcomingTasks = async () => {
    try {
      setLoading(true);
      if (user?.uid) {
        // Get tasks due in next 7 days
        const upcomingTasks = await getUpcomingTasks(user.uid, 7);
        setTasks(upcomingTasks);

        // Load transaction names
        const txNames = {};
        for (const task of upcomingTasks) {
          if (task.transactionId && !txNames[task.transactionId]) {
            try {
              const tx = await getTransaction(user.uid, task.transactionId);
              if (tx) {
                txNames[task.transactionId] = `${tx.firstName || 'Unknown'} ${tx.lastName || ''}`;
              }
            } catch (err) {
              console.error('Error fetching transaction name:', err);
            }
          }
        }
        setTransactionNames(txNames);
      }
    } catch (err) {
      console.error('Error loading upcoming tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(user.uid, taskId, { status: newStatus });
      await loadUpcomingTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return '#FF6B6B';
      case 'high':
        return '#FFA500';
      case 'medium':
        return '#FFD700';
      case 'low':
        return '#4CAF50';
      default:
        return '#999999';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} style={{ color: '#4CAF50' }} />;
      case 'in-progress':
        return <Clock size={16} style={{ color: '#FFA500' }} />;
      default:
        return <AlertCircle size={16} style={{ color: '#999999' }} />;
    }
  };

  return (
    <div style={styles.widget}>
      <div style={styles.widgetHeader}>
        <h3 style={styles.widgetTitle}>Upcoming Tasks (Next 7 Days)</h3>
        <button
          onClick={() => navigate('/tasks')}
          style={styles.viewAllButton}
          title="View all tasks"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {loading ? (
        <div style={styles.loadingState}>
          <p style={styles.loadingText}>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div style={styles.emptyState}>
          <CheckCircle2 size={32} style={{ color: '#4CAF50', marginBottom: '12px' }} />
          <p style={styles.emptyText}>No tasks in the next 7 days</p>
        </div>
      ) : (
        <div style={styles.tasksList}>
          <div style={styles.filterBar}>
            <label style={styles.filterLabel}>
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                style={styles.checkbox}
              />
              Show Completed Tasks
            </label>
          </div>
          {tasks
            .filter(t => showCompleted || t.status !== 'completed')
            .slice(0, 5)
            .map((task) => (
              <div key={task.id} style={styles.taskItem}>
              <div style={styles.taskMainContent}>
                <div style={styles.taskStatusIcon}>
                  {getStatusIcon(task.status)}
                </div>
                <div style={styles.taskInfo}>
                  <div style={styles.taskTitleRow}>
                    <h4 style={styles.taskTitle}>{task.title}</h4>
                    <span
                      style={{
                        ...styles.priorityBadge,
                        backgroundColor: getPriorityColor(task.priority),
                        color: '#000000'
                      }}
                    >
                      {task.priority.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {transactionNames[task.transactionId] && (
                    <p style={styles.transactionName}>
                      {transactionNames[task.transactionId]}
                    </p>
                  )}
                  <p style={styles.taskDueDate}>{formatDate(task.dueDate)}</p>
                </div>
              </div>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                style={styles.statusSelect}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            ))}
          {tasks.filter(t => showCompleted || t.status !== 'completed').length > 5 && (
            <button
              onClick={() => navigate('/tasks')}
              style={styles.viewMoreButton}
            >
              View All {tasks.filter(t => showCompleted || t.status !== 'completed').length} Tasks
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  widget: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '24px',
    transition: 'all 0.3s ease'
  },
  widgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  widgetTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0',
    color: '#FFFFFF'
  },
  viewAllButton: {
    backgroundColor: 'transparent',
    border: '1px solid #333333',
    color: '#D4AF37',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s ease'
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  filterBar: {
    padding: '12px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '6px',
    marginBottom: '8px'
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#CCCCCC',
    margin: '0',
    cursor: 'pointer',
    fontWeight: '500'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#D4AF37'
  },
  taskItem: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '6px',
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s ease'
  },
  taskMainContent: {
    display: 'flex',
    gap: '10px',
    flex: 1,
    minWidth: 0
  },
  taskStatusIcon: {
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskInfo: {
    flex: 1,
    minWidth: 0
  },
  taskTitleRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '4px'
  },
  taskTitle: {
    fontSize: '13px',
    fontWeight: '500',
    margin: '0',
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  priorityBadge: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '3px',
    whiteSpace: 'nowrap',
    flexShrink: 0
  },
  transactionName: {
    fontSize: '11px',
    color: '#D4AF37',
    margin: '0 0 2px 0',
    fontStyle: 'italic'
  },
  taskDueDate: {
    fontSize: '11px',
    color: '#999999',
    margin: '0'
  },
  statusSelect: {
    padding: '6px 8px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    flexShrink: 0
  },
  loadingState: {
    padding: '20px',
    textAlign: 'center'
  },
  loadingText: {
    fontSize: '13px',
    color: '#999999',
    margin: '0'
  },
  emptyState: {
    padding: '30px 20px',
    textAlign: 'center'
  },
  emptyText: {
    fontSize: '13px',
    color: '#999999',
    margin: '0'
  },
  viewMoreButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#333333',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    marginTop: '8px',
    transition: 'all 0.2s ease'
  }
};
