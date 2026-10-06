import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommissionsDashboard from '../components/CommissionsDashboard';
import { ArrowLeft } from 'lucide-react';

export default function CommissionsPage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <button
          onClick={() => navigate('/dashboard')}
          style={styles.backButton}
          title="Back to Dashboard"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={styles.pageTitle}>Commissions</h1>
        {userRole === 'Admin' && (
          <button
            onClick={() => navigate('/admin/agent-settings')}
            style={styles.settingsButton}
            title="Manage Agent Commission Settings"
          >
            Agent Settings
          </button>
        )}
      </div>

      <div style={styles.content}>
        <CommissionsDashboard />
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0d0d0d',
    color: '#FFFFFF'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #333333',
    gap: '16px'
  },
  backButton: {
    backgroundColor: 'transparent',
    border: '1px solid #333333',
    color: '#FFFFFF',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500'
  },
  pageTitle: {
    flex: 1,
    fontSize: '24px',
    fontWeight: '600',
    margin: '0',
    color: '#FFFFFF'
  },
  settingsButton: {
    backgroundColor: '#D4AF37',
    border: 'none',
    color: '#000000',
    borderRadius: '6px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease'
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px'
  }
};
