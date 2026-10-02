import React, { useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import { mockTasks, getTasksByAssignee } from '../data/mockTasks';

function TCDashboard({ currentUser }) {
  const [metrics, setMetrics] = useState({
    skylopeEntries: 0,
    mlsEntries: 0,
    pendingDeadlines: 0,
    completedTasks: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Get TC tasks
    const tcTasks = getTasksByAssignee(currentUser.id);
    setTasks(tcTasks);

    // Get all transactions for TC to coordinate
    setTransactions(mockTransactions);

    // Calculate metrics
    const skylopeCount = tcTasks.filter(t => t.type === 'skyslope-entry').length;
    const mlsCount = tcTasks.filter(t => t.type === 'mls-entry').length;
    const pendingCount = tcTasks.filter(t => t.status === 'pending').length;
    const completedCount = tcTasks.filter(t => t.status === 'completed').length;

    setMetrics({
      skylopeEntries: skylopeCount,
      mlsEntries: mlsCount,
      pendingDeadlines: pendingCount,
      completedTasks: completedCount,
    });
  }, [currentUser]);

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
          Transaction Coordinator Dashboard - Skyslope & MLS Tracking
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
            {metrics.skylopeEntries}
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
            {metrics.mlsEntries}
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
            Pending Deadlines
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
            {transactions.filter(t => t.status !== 'closed').length > 0 ? (
              transactions
                .filter(t => t.status !== 'closed')
                .slice(0, 5)
                .map(t => (
                  <div
                    key={t.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f8f9fa',
                      borderLeft: '4px solid #3498db',
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                      {t.propertyAddress}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                      <div>Agent: {t.agentName}</div>
                      <div>Status: {t.status}</div>
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
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#ffe6e6',
                      borderLeft: '4px solid #e74c3c',
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