import React, { useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import { mockTasks, getTasksByAssignee } from '../data/mockTasks';

function ClosingConciergeDashboard({ currentUser }) {
  const [closingTasks, setClosingTasks] = useState([]);
  const [upcomingClosings, setUpcomingClosings] = useState([]);
  const [metrics, setMetrics] = useState({
    totalClosings: 0,
    nextWeek: 0,
    checklistsPrepared: 0,
    pending: 0,
  });

  useEffect(() => {
    // Get concierge tasks
    const conciergeTasks = getTasksByAssignee(currentUser.id);
    setClosingTasks(conciergeTasks);

    // Get closing transactions
    const closingTransactions = mockTransactions.filter(t => t.status === 'closed');
    setUpcomingClosings(closingTransactions);

    // Calculate metrics
    const nextWeek = closingTransactions.filter(t => {
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      const closingDate = new Date(t.closingDate);
      return closingDate >= today && closingDate <= weekFromNow;
    }).length;

    const checklistCount = conciergeTasks.filter(t => t.type === 'closing-checklist').length;
    const pendingCount = conciergeTasks.filter(t => t.status === 'pending').length;

    setMetrics({
      totalClosings: closingTransactions.length,
      nextWeek: nextWeek,
      checklistsPrepared: checklistCount,
      pending: pendingCount,
    });
  }, [currentUser]);

  const getTaskType = (type) => {
    switch (type) {
      case 'closing-checklist': return { icon: '📋', color: '#3498db' };
      default: return { icon: '✓', color: '#95a5a6' };
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
          Closing Concierge Dashboard - Closing Coordination
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
            {metrics.totalClosings}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Total Closings
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
            {metrics.nextWeek}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Closing This Week
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
            {metrics.checklistsPrepared}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Checklists
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
            {metrics.pending}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Pending
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
      }}>
        {/* Upcoming Closings */}
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
            📅 Upcoming Closings
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {upcomingClosings.length > 0 ? (
              upcomingClosings.map(t => (
                <div
                  key={t.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#e3f2fd',
                    borderLeft: '4px solid #3498db',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                    {t.propertyAddress}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '0.5rem' }}>
                    <div>Buyer: {t.buyerName}</div>
                    <div>Closing: {new Date(t.closingDate).toLocaleDateString()}</div>
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'white',
                    display: 'inline-block',
                    backgroundColor: '#3498db',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                  }}>
                    Type: {t.type}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
                No upcoming closings
              </div>
            )}
          </div>
        </div>

        {/* My Tasks */}
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
            ✓ My Tasks
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {closingTasks.length > 0 ? (
              closingTasks
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .map(task => {
                  const typeInfo = getTaskType(task.type);
                  return (
                    <div
                      key={task.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#f8f9fa',
                        borderLeft: `4px solid ${typeInfo.color}`,
                        borderRadius: '4px',
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                        {typeInfo.icon} {task.description}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                        <div>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                        <div style={{ marginTop: '0.5rem' }}>
                          <select
                            value={task.status}
                            style={{
                              padding: '0.4rem 0.6rem',
                              borderRadius: '3px',
                              border: '1px solid #ddd',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
                No tasks assigned
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClosingConciergeDashboard;
