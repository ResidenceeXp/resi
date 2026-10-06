import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, updateTask } from '../services/taskService';
import { Clock, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

export default function TransactionTasksList({ transactionId }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    loadTransactionTasks();
  }, [user?.uid, transactionId]);

  const loadTransactionTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      if (user?.uid) {
        // Get all tasks and filter by this transaction
        const allTasks = await getTasks(user.uid);
        const txTasks = allTasks.filter(t => t.transactionId === transactionId);
        // Sort by due date
        txTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setTasks(txTasks);
      }
    } catch (err) {
      console.error('Error loading transaction tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(user.uid, taskId, { status: newStatus });
      await loadTransactionTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false;
    return new Date(dueDate) < new Date().toISOString().split('T')[0];
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
        return <CheckCircle2 size={18} style={{ color: '#4CAF50' }} />;
      case 'in-progress':
        return <Clock size={18} style={{ color: '#FFA500' }} />;
      default:
        return <AlertCircle size={18} style={{ color: '#999999' }} />;
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.sectionTitle}>Transaction Tasks</h3>
        <div style={styles.loadingBox}>
          <p style={styles.loadingText}>Loading tasks...</p>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter(t => showCompleted || t.status !== 'completed');

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.sectionTitle}>Transaction Tasks</h3>
        {tasks.length > 0 && (
          <label style={styles.filterLabel}>
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              style={styles.checkbox}
            />
            Show Completed
          </label>
        )}
      </div>

      {error && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {tasks.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>No tasks associated with this transaction yet</p>
        </div>
      ) : (
        <div style={styles.tasksList}>
          {/* Summary Stats */}
          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Total:</span>
              <span style={styles.statValue}>{tasks.length}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Completed:</span>
              <span style={styles.statValue}>{tasks.filter(t => t.status === 'completed').length}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Pending:</span>
              <span style={styles.statValue}>{tasks.filter(t => t.status === 'pending').length}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Overdue:</span>
              <span style={{
                ...styles.statValue,
                color: tasks.some(t => isOverdue(t.dueDate, t.status)) ? '#FF6B6B' : '#4CAF50'
              }}>
                {tasks.filter(t => isOverdue(t.dueDate, t.status)).length}
              </span>
            </div>
          </div>

          {/* Tasks Table */}
          <div style={styles.tasksTable}>
            {filteredTasks.length === 0 ? (
              <div style={styles.emptyMessage}>
                <p style={styles.emptyText}>No {showCompleted ? 'tasks' : 'active tasks'}</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  ...styles.taskRow,
                  backgroundColor: isOverdue(task.dueDate, task.status)
                    ? '#2a1a1a'
                    : '#1a1a1a',
                  borderLeftColor: getPriorityColor(task.priority)
                }}
              >
                <div style={styles.taskMainSection}>
                  <div style={styles.taskStatusIcon}>
                    {getStatusIcon(task.status)}
                  </div>
                  <div style={styles.taskContent}>
                    <h4 style={styles.taskTitle}>{task.title}</h4>
                    <p style={styles.taskDescription}>{task.description}</p>
                  </div>
                </div>

                <div style={styles.taskDetailsSection}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Due:</span>
                    <span
                      style={{
                        ...styles.detailValue,
                        color: isOverdue(task.dueDate, task.status)
                          ? '#FF6B6B'
                          : '#FFFFFF'
                      }}
                    >
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Category:</span>
                    <span style={styles.detailValue}>
                      {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailLabel}>Priority:</span>
                    <span
                      style={{
                        ...styles.detailValue,
                        color: getPriorityColor(task.priority)
                      }}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                </div>

                <div style={styles.taskActions}>
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
              </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '1px solid #333333'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '16px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0',
    color: '#FFFFFF'
  },
  filterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#CCCCCC',
    margin: '0',
    cursor: 'pointer',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#D4AF37'
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  statItem: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '6px',
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '12px',
    color: '#999999',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#D4AF37'
  },
  tasksTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  taskRow: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderLeft: '4px solid #D4AF37',
    borderRadius: '6px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.2s ease'
  },
  taskMainSection: {
    display: 'flex',
    gap: '12px',
    flex: 1,
    minWidth: 0
  },
  taskStatusIcon: {
    minWidth: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  taskContent: {
    flex: 1,
    minWidth: 0
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#FFFFFF'
  },
  taskDescription: {
    fontSize: '12px',
    color: '#999999',
    margin: '0'
  },
  taskDetailsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(80px, 1fr))',
    gap: '12px',
    minWidth: 'fit-content'
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    whiteSpace: 'nowrap'
  },
  detailLabel: {
    fontSize: '10px',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: '12px',
    color: '#FFFFFF',
    fontWeight: '500'
  },
  taskActions: {
    minWidth: '120px'
  },
  statusSelect: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  loadingBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '6px',
    padding: '20px',
    textAlign: 'center'
  },
  loadingText: {
    color: '#999999',
    fontSize: '13px',
    margin: '0'
  },
  emptyBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '6px',
    padding: '20px',
    textAlign: 'center'
  },
  emptyMessage: {
    padding: '20px',
    textAlign: 'center'
  },
  emptyText: {
    color: '#999999',
    fontSize: '13px',
    margin: '0'
  },
  errorBox: {
    backgroundColor: '#3a1a1a',
    border: '1px solid #d32f2f',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px'
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: '13px',
    margin: '0'
  }
};
