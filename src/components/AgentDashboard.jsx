import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import mockTasks - removed

function AgentDashboard({ currentUser }) {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    activeListings: 0,
    activeBuyers: 0,
    closedThisMonth: 0,
    pendingTasks: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Get agent's tasks
    const agentTasks = [];
    setTasks(agentTasks);

    // Get agent's transactions
    const agentTransactions = [];
    setTransactions(agentTransactions);

    // Calculate metrics
    const activeListing = agentTransactions.filter(t => t.type === 'seller-listing' && t.status === 'listing-active').length;
    const activeBuyer = agentTransactions.filter(t => t.type === 'buyer' && t.status === 'under-contract').length;
    const closedMonth = agentTransactions.filter(t => t.status === 'closed').length;
    const pendingCount = agentTasks.filter(t => t.status === 'pending').length;

    setMetrics({
      activeListings: activeListing,
      activeBuyers: activeBuyer,
      closedThisMonth: closedMonth,
      pendingTasks: pendingCount,
    });
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#95a5a6';
      case 'under-contract': return '#f39c12';
      case 'listing-active': return '#e74c3c';
      case 'closed': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        marginBottom: '2rem',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
            Welcome, {currentUser.firstName}!
          </h1>
          <p style={{ margin: 0, color: '#7f8c8d' }}>
            Agent Dashboard - Your Active Transactions & Tasks
          </p>
        </div>
        <button
          onClick={() => navigate('/commissions')}
          style={{
            backgroundColor: '#D4AF37',
            color: '#000',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}>
          View Commissions
        </button>
      </div>

      {/* Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {metrics.activeListings}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Active Listings
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {metrics.activeBuyers}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Active Buyers
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {metrics.closedThisMonth}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Closed This Month
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {metrics.pendingTasks}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Pending Tasks
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
      }}>
        {/* Active Transactions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            margin: '0 0 1.5rem 0',
            color: '#2c3e50',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '1rem',
          }}>
            Active Transactions
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {transactions.length > 0 ? (
              transactions.map(t => (
                <div
                  key={t.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    borderLeft: `4px solid ${getStatusColor(t.status)}`,
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                    {t.propertyAddress}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '0.5rem' }}>
                    <div>{t.type === 'buyer' ? 'Buyer' : 'Seller'}</div>
                    <div>Price: ${t.price ? t.price.toLocaleString() : 'TBD'}</div>
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'white',
                    display: 'inline-block',
                    backgroundColor: getStatusColor(t.status),
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                  }}>
                    {t.status}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
                No active transactions
              </div>
            )}
          </div>
        </div>

        {/* Pending Tasks */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            margin: '0 0 1.5rem 0',
            color: '#2c3e50',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '1rem',
          }}>
            My Tasks
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {tasks.filter(t => t.status === 'pending').length > 0 ? (
              tasks
                .filter(t => t.status === 'pending')
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#fffacd',
                      borderLeft: '4px solid #f39c12',
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                      {task.description}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
            ) : (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
                No pending tasks
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;