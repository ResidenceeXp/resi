import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Send, CheckSquare, Bell, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, userRole, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>RESIDENCE</h1>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.userInfo}>
            <span style={styles.email}>{user?.email}</span>
            <span style={styles.roleBadge}>{userRole}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h2 style={styles.sectionTitle}>Dashboard</h2>
        <p style={styles.sectionSubtitle}>Welcome back, {user?.email}</p>

        <div style={styles.cardsGrid}>
          <div style={styles.card} onClick={() => navigate('/transactions')}>
            <Send size={32} style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Transactions</h3>
            <p style={styles.cardDescription}>Manage your transactions</p>
          </div>

          <div style={styles.card}>
            <CheckSquare size={32} style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Checklists</h3>
            <p style={styles.cardDescription}>Track action items</p>
          </div>

          <div style={styles.card}>
            <Bell size={32} style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Notifications</h3>
            <p style={styles.cardDescription}>View notifications</p>
          </div>

          {userRole === 'Admin' && (
            <div style={styles.card} onClick={() => navigate('/admin')}>
              <Users size={32} style={styles.cardIcon} />
              <h3 style={styles.cardTitle}>User Management</h3>
              <p style={styles.cardDescription}>Manage team members</p>
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
    color: '#FFFFFF'
  },
  header: {
    backgroundColor: '#1a1a1a',
    borderBottom: '2px solid #D4AF37',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    flex: 1
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
    letterSpacing: '2px',
    color: '#D4AF37'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  email: {
    fontSize: '14px',
    color: '#FFFFFF'
  },
  roleBadge: {
    fontSize: '12px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    padding: '4px 12px',
    borderRadius: '12px',
    fontWeight: '600'
  },
  logoutButton: {
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
  mainContent: {
    padding: '40px'
  },
  sectionTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#FFFFFF'
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#999999',
    margin: '0 0 32px 0'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  cardIcon: {
    color: '#D4AF37',
    marginBottom: '16px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#FFFFFF'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#999999',
    margin: '0'
  }
};
