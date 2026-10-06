import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, FileText, Bell, CheckSquare, ListTodo } from 'lucide-react';
import { getLogoBooleanTheme } from '../utils/themeUtils';
import AdminDashboard from '../components/AdminDashboard';
import AgentDashboard from '../components/AgentDashboard';
import BuyerDashboard from '../components/BuyerDashboard';
import ClosingConciergeDashboard from '../components/ClosingConciergeDashboard';
import LocalAssistantDashboard from '../components/LocalAssistantDashboard';
import MarketingManagerDashboard from '../components/MarketingManagerDashboard';
import TCDashboard from '../components/TCDashboard';
import UpcomingTasksWidget from '../components/UpcomingTasksWidget';

export default function Dashboard() {
  const { user, userRole, displayName, logout } = useAuth();
  const navigate = useNavigate();
  // Dark theme for dashboard (black background)
  const isDarkTheme = true;
  const logoSrc = '/resi-logo-white.png';

  // Route to role-specific dashboard
  if (userRole === 'Admin') {
    return <AdminDashboard />;
  }
  if (userRole === 'Agent') {
    return <AgentDashboard />;
  }
  if (userRole === 'Buyer') {
    return <BuyerDashboard />;
  }
  if (userRole === 'Closing Concierge') {
    return <ClosingConciergeDashboard />;
  }
  if (userRole === 'Local Assistant') {
    return <LocalAssistantDashboard />;
  }
  if (userRole === 'Marketing Manager') {
    return <MarketingManagerDashboard />;
  }
  if (userRole === 'Transaction Coordinator') {
    return <TCDashboard />;
  }

  // For other roles or no role assigned, show generic dashboard
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <img src={logoSrc} alt="Resi" style={styles.logo} />
          <div style={styles.userInfo}>
            <span style={styles.userEmail}>{user?.email}</span>
            <span style={styles.roleBadge}>{userRole}</span>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.welcomeSection}>
          <h2 style={styles.greeting}>Welcome back!</h2>
          <p style={styles.subtitle}>
            {displayName || user?.email}
          </p>
        </div>

        {/* Upcoming Tasks Widget */}
        <div style={styles.upcomingTasksSection}>
          <UpcomingTasksWidget />
        </div>

        {/* Navigation Grid */}
        <div style={styles.grid}>
          {/* Transactions */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>
              <FileText size={32} />
            </div>
            <h3 style={styles.cardTitle}>Transactions</h3>
            <p style={styles.cardDescription}>View and manage all transactions</p>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => navigate('/transactions')}
                style={styles.cardButton}
              >
                View Transactions
              </button>
              <button
                onClick={() => navigate('/transactions/new')}
                style={{...styles.cardButton, backgroundColor: '#FFFFFF', color: '#000000'}}
              >
                Create New
              </button>
            </div>
          </div>

          {/* Tasks */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>
              <ListTodo size={32} />
            </div>
            <h3 style={styles.cardTitle}>Tasks</h3>
            <p style={styles.cardDescription}>Track deadline-based tasks</p>
            <button
              onClick={() => navigate('/tasks')}
              style={styles.cardButton}
            >
              View Tasks
            </button>
          </div>

          {/* Checklists */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>
              <CheckSquare size={32} />
            </div>
            <h3 style={styles.cardTitle}>Checklists</h3>
            <p style={styles.cardDescription}>Track transaction checklists</p>
            <button style={styles.cardButton} disabled>
              Coming Soon
            </button>
          </div>

          {/* Notifications */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>
              <Bell size={32} />
            </div>
            <h3 style={styles.cardTitle}>Notifications</h3>
            <p style={styles.cardDescription}>View task and closing reminders</p>
            <button
              onClick={() => navigate('/notifications')}
              style={styles.cardButton}
            >
              View Notifications
            </button>
          </div>

          {/* Admin Panel - Only for Admins */}
          {userRole === 'Admin' && (
            <div style={styles.card}>
              <div style={styles.cardIcon}>
                <Users size={32} />
              </div>
              <h3 style={styles.cardTitle}>User Management</h3>
              <p style={styles.cardDescription}>Add and manage team members</p>
              <button
                onClick={() => navigate('/admin')}
                style={styles.cardButton}
              >
                Manage Users
              </button>
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
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px'
  },
  logo: {
    height: '40px',
    width: 'auto',
    maxWidth: '200px'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  userEmail: {
    fontSize: '14px',
    color: '#999999'
  },
  roleBadge: {
    fontSize: '12px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    padding: '4px 12px',
    borderRadius: '4px',
    fontWeight: '600',
    width: 'fit-content',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  logoutButton: {
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
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  mainContent: {
    padding: '40px'
  },
  welcomeSection: {
    marginBottom: '40px'
  },
  greeting: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#FFFFFF',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  subtitle: {
    fontSize: '16px',
    color: '#D4AF37',
    margin: '0',
    letterSpacing: '0.5px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  upcomingTasksSection: {
    marginBottom: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    borderRadius: '8px',
    padding: '24px',
    transition: 'all 0.3s ease'
  },
  cardIcon: {
    color: '#D4AF37',
    marginBottom: '16px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: '8px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#FFFFFF',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#999999',
    margin: '0 0 16px 0',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  cardButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#D4AF37',
    color: '#000000',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexDirection: 'column'
  }
};
