import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks, getOverdueTasks, getUpcomingTasks, updateTask, deleteTask } from '../services/taskService';
import { getTransaction } from '../services/transactionService';
import { ArrowLeft, Trash2, CheckCircle2, Clock, AlertCircle, Filter } from 'lucide-react';
import { getLogoBooleanTheme } from '../utils/themeUtils';

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDarkTheme = true;
  const logoSrc = getLogoBooleanTheme(isDarkTheme);

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, in-progress, completed
  const [filterPriority, setFilterPriority] = useState('all'); // all, critical, high, medium, low
  const [filterView, setFilterView] = useState('all'); // all, overdue, upcoming

  const [transactionNames, setTransactionNames] = useState({});

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, [user]);

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [tasks, filterStatus, filterPriority, filterView, overdueTasks, upcomingTasks]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) throw new Error('User not authenticated');

      const [allTasks, overdue, upcoming] = await Promise.all([
        getTasks(user.uid),
        getOverdueTasks(user.uid),
        getUpcomingTasks(user.uid, 7)
      ]);

      setTasks(allTasks);
      setOverdueTasks(overdue);
      setUpcomingTasks(upcoming);

      // Pre-load transaction names
      const txNames = {};
      for (const task of allTasks) {
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
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...tasks];

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(t => t.status === filterStatus);
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      result = result.filter(t => t.priority === filterPriority);
    }

    // Apply view filter
    if (filterView === 'overdue') {
      result = result.filter(t => overdueTasks.some(ot => ot.id === t.id));
    } else if (filterView === 'upcoming') {
      result = result.filter(t => upcomingTasks.some(ut => ut.id === t.id));
    }

    // Sort by due date
    result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    setFilteredTasks(result);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(user.uid, taskId, { status: newStatus });
      await loadTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask(user.uid, taskId);
      await loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  const handleAddNote = async (taskId, currentNote) => {
    const newNote = prompt('Add or edit note:', currentNote || '');
    if (newNote !== null) {
      try {
        await updateTask(user.uid, taskId, { notes: newNote });
        await loadTasks();
      } catch (err) {
        console.error('Error updating task note:', err);
        setError('Failed to update task note');
      }
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
        return <CheckCircle2 size={18} style={{ color: '#4CAF50' }} />;
      case 'in-progress':
        return <Clock size={18} style={{ color: '#FFA500' }} />;
      default:
        return <AlertCircle size={18} style={{ color: '#999999' }} />;
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

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: overdueTasks.length,
    upcoming: upcomingTasks.length
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.logoButton}>
          <img src={logoSrc} alt="RESIDENCE | eXp Realty" style={styles.logo} />
        </button>
        <h1 style={styles.headerTitle}>Task Management</h1>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{taskStats.total}</div>
          <div style={styles.statLabel}>Total Tasks</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber} style={{ color: '#FFD700' }}>
            {taskStats.pending}
          </div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber} style={{ color: '#FFA500' }}>
            {taskStats.inProgress}
          </div>
          <div style={styles.statLabel}>In Progress</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber} style={{ color: '#4CAF50' }}>
            {taskStats.completed}
          </div>
          <div style={styles.statLabel}>Completed</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber} style={{ color: '#FF6B6B' }}>
            {taskStats.overdue}
          </div>
          <div style={styles.statLabel}>Overdue</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber} style={{ color: '#87CEEB' }}>
            {taskStats.upcoming}
          </div>
          <div style={styles.statLabel}>Upcoming (7d)</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Filters */}
        <div style={styles.filterSection}>
          <div style={styles.filterHeader}>
            <Filter size={20} />
            <h3 style={styles.filterTitle}>Filters</h3>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>View</label>
            <select
              value={filterView}
              onChange={(e) => setFilterView(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Tasks</option>
              <option value="overdue">Overdue Only</option>
              <option value="upcoming">Upcoming (7 days)</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={styles.select}
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div style={styles.tasksSection}>
          {error && (
            <div style={styles.errorBox}>
              <p style={styles.errorText}>{error}</p>
            </div>
          )}

          {loading ? (
            <div style={styles.loadingBox}>
              <p style={styles.loadingText}>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyText}>No tasks match your filters</p>
            </div>
          ) : (
            <div style={styles.tasksList}>
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    ...styles.taskCard,
                    borderLeftColor: getPriorityColor(task.priority),
                    opacity: isOverdue(task.dueDate, task.status) ? 1 : 1,
                    backgroundColor: isOverdue(task.dueDate, task.status)
                      ? '#2a1a1a'
                      : '#1a1a1a'
                  }}
                >
                  {/* Task Header */}
                  <div style={styles.taskHeader}>
                    <div style={styles.taskTitleSection}>
                      <div style={styles.taskStatusIcon}>
                        {getStatusIcon(task.status)}
                      </div>
                      <div>
                        <h4 style={styles.taskTitle}>{task.title}</h4>
                        <p style={styles.taskDescription}>{task.description}</p>
                        {transactionNames[task.transactionId] && (
                          <p style={styles.transactionName}>
                            Transaction: {transactionNames[task.transactionId]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={styles.taskActions}>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={styles.deleteButton}
                        title="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div style={styles.taskDetails}>
                    <div style={styles.taskDetail}>
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
                    <div style={styles.taskDetail}>
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
                    <div style={styles.taskDetail}>
                      <span style={styles.detailLabel}>Category:</span>
                      <span style={styles.detailValue}>
                        {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Status Selector */}
                  <div style={styles.taskStatusSection}>
                    <label style={styles.statusLabel}>Status:</label>
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

                  {/* Notes Section */}
                  {task.notes && (
                    <div style={styles.notesSection}>
                      <p style={styles.notesLabel}>Notes:</p>
                      <p style={styles.notesText}>{task.notes}</p>
                    </div>
                  )}

                  {/* Add Notes Button */}
                  <button
                    onClick={() => handleAddNote(task.id, task.notes)}
                    style={styles.addNoteButton}
                  >
                    {task.notes ? 'Edit Note' : 'Add Note'}
                  </button>
                </div>
              ))}
            </div>
          )}
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
    gap: '20px'
  },
  logoButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    height: '40px',
    width: 'auto',
    maxWidth: '150px'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
    letterSpacing: '2px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  statsBar: {
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #333333',
    padding: '20px 40px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '20px'
  },
  statCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#D4AF37',
    margin: '0 0 8px 0'
  },
  statLabel: {
    fontSize: '12px',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0'
  },
  mainContent: {
    padding: '40px',
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gap: '40px'
  },
  filterSection: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '20px'
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  filterTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#D4AF37',
    margin: '0'
  },
  filterGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  select: {
    padding: '10px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  tasksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  tasksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  taskCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderLeft: '4px solid #D4AF37',
    borderRadius: '8px',
    padding: '20px',
    transition: 'all 0.3s ease'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  taskTitleSection: {
    display: 'flex',
    gap: '12px',
    flex: 1
  },
  taskStatusIcon: {
    marginTop: '4px',
    minWidth: '24px'
  },
  taskTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#FFFFFF'
  },
  taskDescription: {
    fontSize: '13px',
    color: '#999999',
    margin: '0 0 8px 0'
  },
  transactionName: {
    fontSize: '12px',
    color: '#D4AF37',
    margin: '0',
    fontStyle: 'italic'
  },
  taskActions: {
    display: 'flex',
    gap: '8px'
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FF6B6B',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    transition: 'all 0.3s ease'
  },
  taskDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #333333'
  },
  taskDetail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  detailLabel: {
    fontSize: '11px',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  detailValue: {
    fontSize: '14px',
    color: '#FFFFFF',
    fontWeight: '500'
  },
  taskStatusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  statusLabel: {
    fontSize: '12px',
    color: '#999999',
    fontWeight: '600',
    minWidth: '50px'
  },
  statusSelect: {
    padding: '8px 12px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '13px',
    flex: 1,
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  notesSection: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '12px'
  },
  notesLabel: {
    fontSize: '11px',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 8px 0'
  },
  notesText: {
    fontSize: '13px',
    color: '#CCCCCC',
    margin: '0',
    lineHeight: '1.4'
  },
  addNoteButton: {
    padding: '8px 16px',
    backgroundColor: '#333333',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  errorBox: {
    backgroundColor: '#3d2a1a',
    border: '1px solid #D4AF37',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '20px'
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: '14px',
    margin: '0'
  },
  loadingBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center'
  },
  loadingText: {
    color: '#999999',
    fontSize: '14px',
    margin: '0'
  },
  emptyBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center'
  },
  emptyText: {
    color: '#999999',
    fontSize: '14px',
    margin: '0'
  }
};
