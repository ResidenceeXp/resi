import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTransactionsByType } from '../services/transactionService';
import { getTasksByTransaction, getOverdueTasks } from '../services/taskService';
import { Home, Calendar, DollarSign, FileText, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, displayName } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [tasksMap, setTasksMap] = useState({});
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBuyerData();
  }, [user]);

  const loadBuyerData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) throw new Error('User not authenticated');

      // Get all buyer transactions
      const buyerTxs = await getTransactionsByType(user.uid, 'Buyer');
      setTransactions(buyerTxs);

      // Get tasks for each transaction
      const tasksByTx = {};
      for (const tx of buyerTxs) {
        const tasks = await getTasksByTransaction(user.uid, tx.id);
        tasksByTx[tx.id] = tasks;
      }
      setTasksMap(tasksByTx);

      // Get overdue tasks
      const overdue = await getOverdueTasks(user.uid);
      setOverdueTasks(overdue.filter(t =>
        buyerTxs.some(tx => tx.id === t.transactionId)
      ));
    } catch (err) {
      console.error('Error loading buyer data:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTaskStats = (txId) => {
    const txTasks = tasksMap[txId] || [];
    return {
      total: txTasks.length,
      completed: txTasks.filter(t => t.status === 'completed').length,
      pending: txTasks.filter(t => t.status === 'pending').length,
      inProgress: txTasks.filter(t => t.status === 'in-progress').length
    };
  };

  const daysToClosing = (closingDate) => {
    if (!closingDate) return null;
    const today = new Date();
    const closing = new Date(closingDate);
    const days = Math.ceil((closing - today) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Buyer Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {displayName || user?.email}</p>
        </div>
        <button
          onClick={() => navigate('/transactions/new/buyer')}
          style={styles.newTransactionButton}
        >
          + New Buyer Transaction
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {loading ? (
          <div style={styles.loadingBox}>
            <p style={styles.loadingText}>Loading your transactions...</p>
          </div>
        ) : error ? (
          <div style={styles.errorBox}>
            <AlertCircle size={24} style={{ color: '#FF6B6B' }} />
            <p style={styles.errorText}>{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div style={styles.emptyBox}>
            <Home size={48} style={{ color: '#D4AF37', marginBottom: '16px' }} />
            <h2 style={styles.emptyTitle}>No Buyer Transactions Yet</h2>
            <p style={styles.emptyText}>Create your first buyer transaction to get started</p>
            <button
              onClick={() => navigate('/transactions/new/buyer')}
              style={styles.emptyButton}
            >
              Create First Transaction
            </button>
          </div>
        ) : (
          <>
            {/* Overdue Tasks Alert */}
            {overdueTasks.length > 0 && (
              <div style={styles.alertBox}>
                <div style={styles.alertContent}>
                  <AlertCircle size={20} style={{ color: '#FF6B6B' }} />
                  <div>
                    <p style={styles.alertTitle}>
                      {overdueTasks.length} Overdue Task{overdueTasks.length !== 1 ? 's' : ''}
                    </p>
                    <p style={styles.alertText}>
                      Please review and complete your overdue tasks
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/tasks')}
                  style={styles.alertButton}
                >
                  View Tasks
                </button>
              </div>
            )}

            {/* Transactions Grid */}
            <div style={styles.transactionsGrid}>
              {transactions.map((transaction) => {
                const stats = getTaskStats(transaction.id);
                const days = daysToClosing(transaction.closingDate);
                const completionRate = stats.total > 0
                  ? Math.round((stats.completed / stats.total) * 100)
                  : 0;

                return (
                  <div key={transaction.id} style={styles.transactionCard}>
                    {/* Card Header */}
                    <div style={styles.cardHeader}>
                      <div>
                        <h3 style={styles.cardTitle}>
                          {transaction.propertyAddress}
                        </h3>
                        <p style={styles.cardSubtitle}>
                          {transaction.city}, {transaction.state} {transaction.zipCode}
                        </p>
                      </div>
                      {days !== null && days > 0 && (
                        <div style={styles.daysToClosing}>
                          <div style={styles.daysNumber}>{days}</div>
                          <div style={styles.daysLabel}>days</div>
                        </div>
                      )}
                    </div>

                    {/* Key Dates */}
                    <div style={styles.datesGrid}>
                      <div style={styles.dateItem}>
                        <span style={styles.dateLabel}>Offer Date</span>
                        <span style={styles.dateValue}>
                          {formatDate(transaction.offerDate)}
                        </span>
                      </div>
                      <div style={styles.dateItem}>
                        <span style={styles.dateLabel}>Closing Date</span>
                        <span style={{
                          ...styles.dateValue,
                          color: days !== null && days < 0 ? '#FF6B6B' : '#FFFFFF'
                        }}>
                          {formatDate(transaction.closingDate)}
                        </span>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div style={styles.financialGrid}>
                      <div style={styles.financeItem}>
                        <DollarSign size={16} style={{ color: '#D4AF37' }} />
                        <div>
                          <p style={styles.financeLabel}>Offer Price</p>
                          <p style={styles.financeValue}>
                            ${transaction.offerPrice ? parseFloat(transaction.offerPrice).toLocaleString() : 'TBD'}
                          </p>
                        </div>
                      </div>
                      <div style={styles.financeItem}>
                        <DollarSign size={16} style={{ color: '#D4AF37' }} />
                        <div>
                          <p style={styles.financeLabel}>Down Payment</p>
                          <p style={styles.financeValue}>
                            ${transaction.downPaymentAmount ? parseFloat(transaction.downPaymentAmount).toLocaleString() : 'TBD'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Task Progress */}
                    <div style={styles.taskProgress}>
                      <div style={styles.progressHeader}>
                        <span style={styles.progressLabel}>Task Progress</span>
                        <span style={styles.progressPercent}>{completionRate}%</span>
                      </div>
                      <div style={styles.progressBar}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${completionRate}%`
                          }}
                        />
                      </div>
                      <div style={styles.taskStats}>
                        <div style={styles.taskStat}>
                          <CheckCircle2 size={14} style={{ color: '#4CAF50' }} />
                          <span>{stats.completed} completed</span>
                        </div>
                        <div style={styles.taskStat}>
                          <span style={{ color: '#FFD700' }}>●</span>
                          <span>{stats.pending} pending</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={styles.cardActions}>
                      <button
                        onClick={() => navigate(`/transactions/${transaction.id}`)}
                        style={styles.actionButton}
                      >
                        <FileText size={16} />
                        View Details
                      </button>
                      <button
                        onClick={() => navigate('/tasks')}
                        style={{...styles.actionButton, backgroundColor: '#333333'}}
                      >
                        <Calendar size={16} />
                        Tasks
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div style={styles.quickActionsSection}>
              <h3 style={styles.quickActionsTitle}>Quick Actions</h3>
              <div style={styles.quickActionsGrid}>
                <button
                  onClick={() => navigate('/tasks')}
                  style={styles.quickActionCard}
                >
                  <Calendar size={24} style={{ color: '#D4AF37' }} />
                  <span>View All Tasks</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate('/transactions')}
                  style={styles.quickActionCard}
                >
                  <FileText size={24} style={{ color: '#D4AF37' }} />
                  <span>All Transactions</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
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
    padding: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#FFFFFF'
  },
  subtitle: {
    fontSize: '14px',
    color: '#D4AF37',
    margin: '0',
    letterSpacing: '0.5px'
  },
  newTransactionButton: {
    padding: '12px 24px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  },
  mainContent: {
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  loadingBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '60px 20px',
    textAlign: 'center'
  },
  loadingText: {
    color: '#999999',
    fontSize: '16px',
    margin: '0'
  },
  errorBox: {
    backgroundColor: '#2a1a1a',
    border: '1px solid #FF6B6B',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: '14px',
    margin: '0'
  },
  emptyBox: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '80px 20px',
    textAlign: 'center'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#FFFFFF',
    margin: '0 0 8px 0'
  },
  emptyText: {
    fontSize: '14px',
    color: '#999999',
    margin: '0 0 20px 0'
  },
  emptyButton: {
    padding: '12px 24px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px'
  },
  alertBox: {
    backgroundColor: '#2a1a1a',
    border: '1px solid #FF6B6B',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  alertContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
  },
  alertTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#FF6B6B',
    margin: '0 0 4px 0'
  },
  alertText: {
    fontSize: '13px',
    color: '#999999',
    margin: '0'
  },
  alertButton: {
    padding: '8px 16px',
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px'
  },
  transactionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '40px'
  },
  transactionCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '24px',
    transition: 'all 0.3s ease'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #333333'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    margin: '0 0 4px 0'
  },
  cardSubtitle: {
    fontSize: '13px',
    color: '#999999',
    margin: '0'
  },
  daysToClosing: {
    textAlign: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: '8px',
    padding: '12px 16px',
    minWidth: '80px'
  },
  daysNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#D4AF37'
  },
  daysLabel: {
    fontSize: '11px',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  datesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px'
  },
  dateItem: {
    backgroundColor: '#0a0a0a',
    borderRadius: '4px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  dateLabel: {
    fontSize: '11px',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  dateValue: {
    fontSize: '13px',
    color: '#FFFFFF',
    fontWeight: '500'
  },
  financialGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #333333'
  },
  financeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  financeLabel: {
    fontSize: '11px',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0'
  },
  financeValue: {
    fontSize: '14px',
    color: '#FFFFFF',
    fontWeight: '600',
    margin: '0'
  },
  taskProgress: {
    marginBottom: '16px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  progressLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#999999'
  },
  progressPercent: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#D4AF37'
  },
  progressBar: {
    backgroundColor: '#0a0a0a',
    borderRadius: '4px',
    height: '8px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  progressFill: {
    backgroundColor: '#D4AF37',
    height: '100%',
    transition: 'width 0.3s ease'
  },
  taskStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px'
  },
  taskStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#999999'
  },
  cardActions: {
    display: 'flex',
    gap: '12px'
  },
  actionButton: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.3s ease'
  },
  quickActionsSection: {
    marginTop: '40px',
    paddingTop: '30px',
    borderTop: '1px solid #333333'
  },
  quickActionsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#D4AF37',
    margin: '0 0 20px 0',
    letterSpacing: '0.5px'
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px'
  },
  quickActionCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: '14px',
    color: '#FFFFFF',
    fontWeight: '600'
  }
};
