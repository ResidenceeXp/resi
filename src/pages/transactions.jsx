import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Transactions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showNewForm, setShowNewForm] = useState(false);
  const [representation, setRepresentation] = useState('');
  const [buyerType, setBuyerType] = useState('');

  const representationTypes = ['Buyer', 'Seller', 'Landlord', 'Tenant'];
  const buyerTypes = ['Resale', 'New Construction'];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 style={styles.headerTitle}>Transactions</h1>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          style={styles.newTransactionButton}
        >
          <Plus size={20} />
          New Transaction
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* New Transaction Form */}
        {showNewForm && (
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>Create New Transaction</h2>

            <div style={styles.formSection}>
              <label style={styles.label}>Representation Type</label>
              <div style={styles.radioGroup}>
                {representationTypes.map(type => (
                  <label key={type} style={styles.radioLabel}>
                    <input
                      type="radio"
                      value={type}
                      checked={representation === type}
                      onChange={(e) => {
                        setRepresentation(e.target.value);
                        setBuyerType('');
                      }}
                      style={styles.radio}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional Buyer Type Question */}
            {representation === 'Buyer' && (
              <div style={styles.formSection}>
                <label style={styles.label}>Buyer Type</label>
                <div style={styles.radioGroup}>
                  {buyerTypes.map(type => (
                    <label key={type} style={styles.radioLabel}>
                      <input
                        type="radio"
                        value={type}
                        checked={buyerType === type}
                        onChange={(e) => setBuyerType(e.target.value)}
                        style={styles.radio}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Next Button */}
            {representation && (representation !== 'Buyer' || buyerType) && (
              <div style={styles.formActions}>
                <button
                  onClick={() => alert(\`Creating \${representation} transaction\${buyerType ? \` (\${buyerType})\` : ''}\`)}
                  style={styles.submitButton}
                >
                  Continue
                </button>
                <button
                  onClick={() => {
                    setShowNewForm(false);
                    setRepresentation('');
                    setBuyerType('');
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No transactions yet.</p>
          <p style={styles.emptySubtext}>Click "New Transaction" to create your first transaction.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#FFFFFF'
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
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: '#D4AF37',
    border: '1px solid #D4AF37',
    padding: '10px 16px',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
    letterSpacing: '2px',
    flex: 1,
    textAlign: 'center'
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
  formCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '32px',
    marginBottom: '40px'
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 24px 0',
    color: '#D4AF37'
  },
  formSection: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#D4AF37',
    marginBottom: '12px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    color: '#FFFFFF',
    cursor: 'pointer'
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#D4AF37'
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  submitButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    backgroundColor: 'transparent',
    color: '#D4AF37',
    border: '1px solid #D4AF37',
    borderRadius: '4px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 40px'
  },
  emptyText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    margin: '0 0 8px 0'
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#999999',
    margin: '0'
  }
};
