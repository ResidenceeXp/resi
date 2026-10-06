import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Home, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../services/transactionService';
import { getLogoBooleanTheme } from '../utils/themeUtils';

export default function Transactions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dark theme for transactions (black background)
  const isDarkTheme = true;
  const logoSrc = getLogoBooleanTheme(isDarkTheme);

  // Load transactions from Firebase
  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getTransactions(user.uid);
        setTransactions(data || []);
      } catch (err) {
        console.error('Error loading transactions:', err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  // Filter and sort transactions
  const filteredTransactions = transactions.filter(t => {
    const query = searchQuery.toLowerCase();
    return (
      t.firstName?.toLowerCase().includes(query) ||
      t.lastName?.toLowerCase().includes(query) ||
      t.email?.toLowerCase().includes(query) ||
      t.phone?.includes(query) ||
      t.propertyAddress?.toLowerCase().includes(query) ||
      t.type?.toLowerCase().includes(query)
    );
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';

    if (sortField === 'date') {
      aValue = new Date(a.createdAt || 0);
      bValue = new Date(b.createdAt || 0);
    } else if (sortField === 'name') {
      aValue = `${a.firstName} ${a.lastName}`;
      bValue = `${b.firstName} ${b.lastName}`;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleViewTransaction = (transaction) => {
    // TODO: Navigate to transaction details page
    navigate(`/transactions/${transaction.id}`, { state: { transaction } });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.logoButton}>
          <img src={logoSrc} alt="RESIDENCE | eXp Realty" style={styles.logo} />
        </button>
        <h1 style={styles.headerTitle}>Transactions</h1>
        <button
          onClick={() => navigate('/transactions/new')}
          style={styles.newTransactionButton}
        >
          <Plus size={20} />
          New Transaction
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>Loading transactions...</p>
          </div>
        )}

        {/* Search and Sort Bar */}
        {!loading && (
          <div style={styles.controlsBar}>
            <div style={styles.searchContainer}>
              <Search size={18} style={{color: '#999'}} />
              <input
                type="text"
                placeholder="Search by name, email, phone, property, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>
        )}

        {/* Transactions List */}
        {!loading && sortedTransactions.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={{...styles.tableCell, ...styles.headerCell, cursor: 'pointer'}} onClick={() => handleSort('name')}>
                    <div style={styles.headerContent}>
                      Client Name
                      {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                  <th style={{...styles.tableCell, ...styles.headerCell}}>Property Address</th>
                  <th style={{...styles.tableCell, ...styles.headerCell, cursor: 'pointer'}} onClick={() => handleSort('type')}>
                    <div style={styles.headerContent}>
                      Type
                      {sortField === 'type' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                  <th style={{...styles.tableCell, ...styles.headerCell, cursor: 'pointer'}} onClick={() => handleSort('date')}>
                    <div style={styles.headerContent}>
                      Date Created
                      {sortField === 'date' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                  <th style={{...styles.tableCell, ...styles.headerCell}}>Contact</th>
                  <th style={{...styles.tableCell, ...styles.headerCell}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((transaction, index) => (
                  <tr key={transaction.id || index} style={styles.tableRow}>
                    <td style={styles.tableCell}>
                      <span style={styles.clientName}>{transaction.firstName} {transaction.lastName}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.address}>{transaction.propertyAddress || transaction.desiredLocation || 'N/A'}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.badge}>{transaction.type}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.date}>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.contact}>{transaction.email}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        style={styles.viewButton}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No transactions yet.</p>
            <p style={styles.emptySubtext}>Click "New Transaction" to create your first transaction.</p>
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
    gap: '20px',
    justifyContent: 'space-between'
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
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  newTransactionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  mainContent: {
    padding: '40px'
  },
  controlsBar: {
    marginBottom: '32px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '4px',
    padding: '12px 16px',
    flex: 1,
    maxWidth: '400px'
  },
  searchInput: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    outline: 'none',
    flex: 1,
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  tableContainer: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  tableHeader: {
    backgroundColor: '#2a2a2a',
    borderBottom: '2px solid #D4AF37'
  },
  headerCell: {
    backgroundColor: '#2a2a2a',
    color: '#D4AF37',
    fontWeight: '600',
    textAlign: 'left',
    padding: '16px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  tableCell: {
    padding: '16px',
    borderBottom: '1px solid #333333',
    fontSize: '14px'
  },
  tableRow: {
    transition: 'background-color 0.2s ease',
    cursor: 'pointer'
  },
  clientName: {
    fontWeight: '600',
    color: '#FFFFFF'
  },
  address: {
    color: '#CCCCCC',
    fontSize: '13px'
  },
  badge: {
    backgroundColor: '#D4AF37',
    color: '#000000',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  date: {
    color: '#999999',
    fontSize: '13px'
  },
  contact: {
    color: '#999999',
    fontSize: '13px'
  },
  viewButton: {
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 40px'
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    margin: '0 0 8px 0',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#999999',
    margin: '0',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  errorBox: {
    backgroundColor: '#3d2a1a',
    border: '1px solid #D4AF37',
    borderRadius: '4px',
    padding: '16px',
    marginBottom: '20px'
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: '14px',
    margin: '0',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }
};
