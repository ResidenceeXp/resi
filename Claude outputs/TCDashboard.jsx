import React, { useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import { mockTasks, getTasksByAssignee } from '../data/mockTasks';

function TCDashboard({ currentUser }) {
  const [transactions, setTransactions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({
    skyslope: 0,
    mls: 0,
    pendingDeadlines: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    // Get all active transactions (TC manages all)
    const allTransactions = mockTransactions.filter(
      t => t.status === 'pending' || t.status === 'under-contract' || t.status === 'listing-active'
    );
    setTransactions(allTransactions);

    // Get TC's tasks
    const tcTasks = getTasksByAssignee(currentUser.id);
    setTasks(tcTasks);

    // Calculate metrics
    const skyslopeTaskCount = tcTasks.filter(t => t.type === 'enter-skyslope').length;
    const mlsTaskCount = tcTasks.filter(t => t.type === 'enter-mls').length;
    const pendingCount = tcTasks.filter(t => t.status === 'pending').length;
    const completedCount = tcTasks.filter(t => t.status === 'completed').length;

    setMetrics({
      skyslope: skyslopeTaskCount,
      mls: mlsTaskCount,
      pendingDeadlines: pendingCount,
      completedTasks: completedCount,
    });
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#95a5a6';
      case 'under-contract': return '#f39c12';
      case 'listing-active': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        marginBottom: '2rem',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '1rem',
      }}>
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
          Welcome, {currentUser.firstName}!
        </h1>
        <p style={{ margin: 0, color: '#7f8c8d' }}>
          Transaction Coordinator Dashboard
        </p>
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
            {metrics.skyslope}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Skyslope Entries
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
            {metrics.mls}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            MLS Entries
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
            {metrics.pendingDeadlines}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Pending Tasks
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
            {metrics.completedTasks}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Completed Tasks
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
                    <span style={{ marginRight: '1rem' }}>Type: {t.type}</span>
                    <span>Agent: {t.agent}</span>
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'white',
                    display: 'inline-block',
                    backgroundColor: getStatusColor(t.status),
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                    textTransform: 'capitalize',
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
            My Pending Tasks
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
                .slice(0, 8)
                .map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f8f9fa',
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

export default TCDashboard;
