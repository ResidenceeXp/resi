import React, { useState, useEffect } from 'react';
import { mockTasks, getTasksByAssignee } from '../data/mockTasks';

function MarketingManagerDashboard({ currentUser }) {
  const [metrics, setMetrics] = useState({
    marketingAssets: 0,
    pendingApprovals: 0,
    pendingTasks: 0,
    completed: 0,
  });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Get marketing tasks
    const marketingTasks = getTasksByAssignee(currentUser.id);
    setTasks(marketingTasks);

    // Calculate metrics
    const assetCount = marketingTasks.filter(t => t.type === 'marketing-asset').length;
    const approvalCount = marketingTasks.filter(t => t.type === 'approval-queue').length;
    const pendingCount = marketingTasks.filter(t => t.status === 'pending').length;
    const completedCount = marketingTasks.filter(t => t.status === 'completed').length;

    setMetrics({
      marketingAssets: assetCount,
      pendingApprovals: approvalCount,
      pendingTasks: pendingCount,
      completed: completedCount,
    });
  }, [currentUser]);

  const getTaskType = (type) => {
    switch (type) {
      case 'marketing-asset': return { icon: '🎨', color: '#9b59b6' };
      case 'approval-queue': return { icon: '✓', color: '#3498db' };
      default: return { icon: '📋', color: '#95a5a6' };
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
          Marketing Manager Dashboard - Asset & Approval Workflow
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
            {metrics.marketingAssets}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Marketing Assets
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
            {metrics.pendingApprovals}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Pending Approvals
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
            {metrics.pendingTasks}
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
            {metrics.completed}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Completed
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem',
      }}>
        {/* Approval Queue */}
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
            Approval Queue
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {tasks.filter(t => t.type === 'approval-queue').length > 0 ? (
              tasks
                .filter(t => t.type === 'approval-queue')
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#e3f2fd',
                      borderLeft: '4px solid #3498db',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                        {task.description}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        style={{
                          padding: '0.4rem 0.8rem',
                          backgroundColor: '#27ae60',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        Approve
                      </button>
                      <button
                        style={{
                          padding: '0.4rem 0.8rem',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
                No pending approvals
              </div>
            )}
          </div>
        </div>

        {/* Task Summary by Type */}
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
            Task Summary by Type
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {['marketing-asset', 'approval-queue'].map(type => {
              const count = tasks.filter(t => t.type === type).length;
              const typeInfo = getTaskType(type);
              return (
                <div key={type} style={{
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                    {typeInfo.icon} {type === 'marketing-asset' ? 'Marketing Assets' : 'Approvals'}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}>
                    <div style={{
                      backgroundColor: typeInfo.color,
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontWeight: '600',
                      minWidth: '50px',
                      textAlign: 'center',
                    }}>
                      {count}
                    </div>
                    <div style={{
                      backgroundColor: '#e0e0e0',
                      height: '8px',
                      borderRadius: '4px',
                      flex: 1,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        backgroundColor: typeInfo.color,
                        height: '100%',
                        width: `${(count / Math.max(metrics.marketingAssets, metrics.pendingApprovals, 1)) * 100}%`,
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketingManagerDashboard;