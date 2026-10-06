import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, get } from 'firebase/database';
import { TrendingUp, DollarSign, Home, AlertCircle } from 'lucide-react';

export default function CommissionsDashboard() {
  const { user, userRole } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [agentSettings, setAgentSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    loadData();
  }, [user?.uid, userRole]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all transactions
      const txnsRef = ref(db, 'transactions');
      const txnSnapshot = await get(txnsRef);

      if (txnSnapshot.exists()) {
        const allTxns = [];
        const txnData = txnSnapshot.val();

        // Parse transactions
        Object.entries(txnData).forEach(([uid, userTxns]) => {
          if (userTxns && typeof userTxns === 'object') {
            Object.entries(userTxns).forEach(([txnId, txn]) => {
              allTxns.push({
                id: txnId,
                agentUid: uid,
                ...txn
              });
            });
          }
        });

        // Filter transactions based on role
        let filteredTxns = allTxns;
        if (userRole !== 'Admin') {
          filteredTxns = allTxns.filter(t => t.agentUid === user.uid);
        }

        setTransactions(filteredTxns);

        // Load agent settings
        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
          const userData = usersSnapshot.val();
          const settings = {};
          const agentList = [];

          Object.entries(userData).forEach(([uid, user]) => {
            if (user.commissionSettings) {
              settings[uid] = user.commissionSettings;
            }
            if (user.role && user.role !== 'Admin') {
              agentList.push({
                uid,
                displayName: user.displayName || user.email,
                email: user.email
              });
            }
          });

          setAgentSettings(settings);
          setAgents(agentList);

          // Set default selected agent for admin view
          if (userRole === 'Admin' && agentList.length > 0) {
            setSelectedAgent(agentList[0].uid);
          } else if (userRole !== 'Admin') {
            setSelectedAgent(user.uid);
          }
        }
      }
    } catch (err) {
      console.error('Error loading commission data:', err);
      setError('Failed to load commission data');
    } finally {
      setLoading(false);
    }
  };

  const calculateCommission = (transaction, agentSettings) => {
    if (!transaction || !agentSettings) return 0;

    let baseCommission = 0;

    // Determine base commission
    if (transaction.commissionType === 'percentage' && transaction.commissionPercentage) {
      const percentage = parseFloat(transaction.commissionPercentage) / 100;
      const price = parseFloat(transaction.purchasePrice || transaction.listingPrice || 0);
      baseCommission = price * percentage;
    } else if (transaction.commissionType === 'dollar' && transaction.commissionDollarAmount) {
      baseCommission = parseFloat(transaction.commissionDollarAmount);
    }

    // Apply splits (team split first, then broker split)
    const teamSplitPercent = parseFloat(agentSettings.teamSplitPercent || 50) / 100;
    const brokerSplitPercent = parseFloat(agentSettings.brokerSplitPercent || 50) / 100;

    const afterTeamSplit = baseCommission * teamSplitPercent;
    const afterBrokerSplit = afterTeamSplit * brokerSplitPercent;

    return Math.round(afterBrokerSplit * 100) / 100;
  };

  const getCommissionStats = (agentUid) => {
    const agentTxns = transactions.filter(t => t.agentUid === agentUid);
    const settings = agentSettings[agentUid];

    if (!settings) {
      return {
        ytdEarned: 0,
        ytdPending: 0,
        ytdTotal: 0,
        capAmount: 0,
        capRemaining: 0,
        capPercentage: 0,
        closedCount: 0,
        pendingCount: 0
      };
    }

    let ytdEarned = 0;
    let ytdPending = 0;
    let closedCount = 0;
    let pendingCount = 0;

    agentTxns.forEach(txn => {
      const commission = calculateCommission(txn, settings);

      if (txn.type === 'Buyer' || txn.type === 'Seller') {
        if (txn.closingDate && new Date(txn.closingDate) <= new Date()) {
          ytdEarned += commission;
          closedCount++;
        } else {
          ytdPending += commission;
          pendingCount++;
        }
      } else if (txn.type === 'Landlord' || txn.type === 'Tenant') {
        if (txn.leaseStartDate && new Date(txn.leaseStartDate) <= new Date()) {
          ytdEarned += commission;
          closedCount++;
        } else {
          ytdPending += commission;
          pendingCount++;
        }
      }
    });

    const capAmount = parseFloat(settings.capAmount || 0);
    const capRemaining = Math.max(0, capAmount - ytdEarned);
    const capPercentage = capAmount > 0 ? Math.round((ytdEarned / capAmount) * 100) : 0;

    return {
      ytdEarned: Math.round(ytdEarned * 100) / 100,
      ytdPending: Math.round(ytdPending * 100) / 100,
      ytdTotal: Math.round((ytdEarned + ytdPending) * 100) / 100,
      capAmount,
      capRemaining: Math.round(capRemaining * 100) / 100,
      capPercentage,
      closedCount,
      pendingCount
    };
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <p style={styles.loadingText}>Loading commission data...</p>
        </div>
      </div>
    );
  }

  const viewAgentUid = selectedAgent || user?.uid;
  const stats = getCommissionStats(viewAgentUid);
  const agentTxns = transactions.filter(t => t.agentUid === viewAgentUid);
  const settings = agentSettings[viewAgentUid];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Commissions Dashboard</h2>

      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} style={{ color: '#FF6B6B' }} />
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {/* Agent Selector (Admin Only) */}
      {userRole === 'Admin' && agents.length > 0 && (
        <div style={styles.agentSelector}>
          <label style={styles.selectorLabel}>Select Agent:</label>
          <select
            value={selectedAgent || ''}
            onChange={(e) => setSelectedAgent(e.target.value)}
            style={styles.selectorInput}
          >
            {agents.map(agent => (
              <option key={agent.uid} value={agent.uid}>
                {agent.displayName} ({agent.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <DollarSign size={24} style={{ color: '#4CAF50' }} />
            <h3 style={styles.statTitle}>YTD Earned</h3>
          </div>
          <p style={styles.statValue}>${stats.ytdEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p style={styles.statSubtext}>{stats.closedCount} closed transactions</p>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <TrendingUp size={24} style={{ color: '#FFA500' }} />
            <h3 style={styles.statTitle}>YTD Pending</h3>
          </div>
          <p style={styles.statValue}>${stats.ytdPending.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p style={styles.statSubtext}>{stats.pendingCount} pending transactions</p>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <Home size={24} style={{ color: '#D4AF37' }} />
            <h3 style={styles.statTitle}>Total YTD</h3>
          </div>
          <p style={styles.statValue}>${stats.ytdTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p style={styles.statSubtext}>{stats.closedCount + stats.pendingCount} total transactions</p>
        </div>

        {stats.capAmount > 0 && (
          <div style={styles.capCard}>
            <div style={styles.capHeader}>
              <h3 style={styles.statTitle}>Commission Cap Progress</h3>
              <span style={styles.capPercentage}>{stats.capPercentage}%</span>
            </div>
            <div style={styles.capBar}>
              <div
                style={{
                  ...styles.capFill,
                  width: `${Math.min(stats.capPercentage, 100)}%`
                }}
              />
            </div>
            <div style={styles.capDetails}>
              <span>${stats.ytdEarned.toLocaleString()} / ${stats.capAmount.toLocaleString()}</span>
              <span style={{ color: stats.capRemaining > 0 ? '#4CAF50' : '#FF6B6B' }}>
                ${stats.capRemaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} remaining
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Commission Settings (Admin Only) */}
      {userRole === 'Admin' && settings && (
        <div style={styles.settingsBox}>
          <h3 style={styles.settingsTitle}>Commission Settings</h3>
          <div style={styles.settingsGrid}>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>Team Split:</span>
              <span style={styles.settingValue}>{settings.teamSplitPercent}%</span>
            </div>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>Broker Split:</span>
              <span style={styles.settingValue}>{settings.brokerSplitPercent}%</span>
            </div>
            <div style={styles.settingItem}>
              <span style={styles.settingLabel}>Cap Anniversary:</span>
              <span style={styles.settingValue}>{settings.capAnniversaryDate || 'Not set'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div style={styles.transactionsSection}>
        <h3 style={styles.sectionTitle}>Recent Transactions</h3>
        {agentTxns.length === 0 ? (
          <p style={styles.emptyText}>No transactions found</p>
        ) : (
          <div style={styles.transactionsTable}>
            {agentTxns.slice(0, 10).map(txn => {
              const commission = calculateCommission(txn, settings);
              const isCompleted = txn.closingDate ? new Date(txn.closingDate) <= new Date() : false;

              return (
                <div key={txn.id} style={styles.transactionRow}>
                  <div style={styles.txnInfo}>
                    <h4 style={styles.txnName}>{txn.firstName} {txn.lastName}</h4>
                    <p style={styles.txnType}>{txn.type} Transaction</p>
                  </div>
                  <div style={styles.txnAmount}>
                    <span style={styles.commission}>${commission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span style={{...styles.txnStatus, color: isCompleted ? '#4CAF50' : '#FFA500'}}>
                      {isCompleted ? 'Closed' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '24px',
    color: '#FFFFFF'
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#FFFFFF'
  },
  errorBox: {
    backgroundColor: '#3a1a1a',
    border: '1px solid #d32f2f',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '16px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start'
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: '13px',
    margin: '0'
  },
  loadingBox: {
    padding: '40px',
    textAlign: 'center'
  },
  loadingText: {
    color: '#999999',
    fontSize: '14px',
    margin: '0'
  },
  agentSelector: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  selectorLabel: {
    fontSize: '13px',
    color: '#CCCCCC',
    fontWeight: '500'
  },
  selectorInput: {
    padding: '8px 12px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontSize: '12px',
    cursor: 'pointer',
    minWidth: '250px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '6px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
  },
  statTitle: {
    fontSize: '12px',
    color: '#999999',
    fontWeight: '500',
    margin: '0',
    textTransform: 'uppercase'
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#D4AF37',
    margin: '0'
  },
  statSubtext: {
    fontSize: '11px',
    color: '#666666',
    margin: '0'
  },
  capCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '6px',
    padding: '16px'
  },
  capHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  capPercentage: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#D4AF37'
  },
  capBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#1a1a1a',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  },
  capFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    transition: 'width 0.3s ease'
  },
  capDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#999999'
  },
  settingsBox: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '24px'
  },
  settingsTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#D4AF37',
    margin: '0 0 12px 0',
    textTransform: 'uppercase'
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
  },
  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    padding: '8px',
    backgroundColor: '#111111',
    borderRadius: '4px'
  },
  settingLabel: {
    color: '#999999',
    fontWeight: '500'
  },
  settingValue: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  transactionsSection: {
    marginTop: '24px'
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
    margin: '0 0 12px 0'
  },
  emptyText: {
    color: '#999999',
    fontSize: '12px',
    textAlign: 'center',
    padding: '20px'
  },
  transactionsTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  transactionRow: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #333333',
    borderRadius: '4px',
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  txnInfo: {
    flex: 1
  },
  txnName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#FFFFFF',
    margin: '0 0 2px 0'
  },
  txnType: {
    fontSize: '11px',
    color: '#999999',
    margin: '0'
  },
  txnAmount: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  commission: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#D4AF37'
  },
  txnStatus: {
    fontSize: '10px',
    fontWeight: '500',
    textTransform: 'uppercase'
  }
};
