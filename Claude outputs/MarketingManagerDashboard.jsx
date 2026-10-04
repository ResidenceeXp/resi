import React, { useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import { mockTasks, getTasksByAssignee } from '../data/mockTasks';

function MarketingManagerDashboard({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [approvalQueue, setApprovalQueue] = useState([]);
  const [metrics, setMetrics] = useState({
    createMarketing: 0,
    approveWorkflow: 0,
    pendingTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    // Get marketing tasks
    const marketingTasks = getTasksByAssignee(currentUser.id);
    setTasks(marketingTasks);

    // Approval queue - tasks waiting for approval
    const approvalTasks = marketingTasks.filter(
      t => t.type.includes('create') && t.status === 'pending'
    );
    setApprovalQueue(approvalTasks);

    // Calculate metrics
    const createCount = marketingTasks.filter(t => t.type.includes('create')).length;
    const approveCount = marketingTasks.filter(t => t.type.includes('approve')).length;
    const pendingCount = marketingTasks.filter(t => t.status === 'pending').length;
    const completedCount = marketingTasks.filter(t => t.status === 'completed').length;

    setMetrics({
      createMarketing: createCount,
      approveWorkflow: approveCount,
      pendingTasks: pendingCount,
      completedTasks: completedCount,
    });
  }, [currentUser]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#95a5a6';
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
          Marketing Manager Dashboard
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
            {metrics.createMarketing}
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
            {approvalQueue.length}
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
            {metrics.completedTasks}
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
            {approvalQueue.length > 0 ? (
              approvalQueue.map(task => (
                <div
                  key={task.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#fff3cd',
                    borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50' }}>
                    {task.description}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '0.5rem' }}>
                    <span style={{ marginRight: '1rem' }}>
                      Priority: <span style={{ color: getPriorityColor(task.priority), fontWeight: '600' }}>
                        {task.priority.toUpperCase()}
                      </span>
                    </span>
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                  }}>
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}>
                      ✓ Approve
                    </button>
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}>
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
                No items pending approval
              </div>
            )}
          </div>
        </div>

        {/* Task Summary */}
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
            {['create-brochure', 'create-feature-cards', 'create-mailer', 'create-social-media-post'].map(type => {
              const typeCount = tasks.filter(t => t.type === type).length;
              const completedCount = tasks.filter(
                t => t.type === type && t.status === 'completed'
              ).length;
              return (
                <div key={type} style={{
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50', textTransform: 'capitalize' }}>
                    {type.replace(/-/g, ' ')}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#7f8c8d',
                    marginBottom: '0.5rem',
                  }}>
                    {completedCount} of {typeCount} completed
                  </div>
                  <div style={{
                    backgroundColor: '#e0e0e0',
                    height: '8px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      backgroundColor: '#27ae60',
                      height: '100%',
                      width: `${typeCount > 0 ? (completedCount / typeCount) * 100 : 0}%`,
                      transition: 'width 0.3s',
                    }} />
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
