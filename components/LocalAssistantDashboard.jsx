import React, { useState, useEffect } from 'react';
import { mockTasks, getTasksByAssignee } from '../data/mockTasks';

function LocalAssistantDashboard({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({
    printDistribution: 0,
    pending: 0,
    completed: 0,
    inProgress: 0,
  });

  useEffect(() => {
    // Get assistant's tasks
    const assistantTasks = getTasksByAssignee(currentUser.id);
    setTasks(assistantTasks);

    // Calculate metrics
    const printCount = assistantTasks.filter(t => t.type === 'print-distribution').length;
    const pendingCount = assistantTasks.filter(t => t.status === 'pending').length;
    const completedCount = assistantTasks.filter(t => t.status === 'completed').length;
    const inProgressCount = assistantTasks.filter(t => t.status === 'in-progress').length;

    setMetrics({
      printDistribution: printCount,
      pending: pendingCount,
      completed: completedCount,
      inProgress: inProgressCount,
    });
  }, [currentUser]);

  const getTaskPriority = (priority) => {
    switch (priority) {
      case 'high': return { bg: '#e74c3c', text: 'white' };
      case 'medium': return { bg: '#f39c12', text: 'white' };
      case 'low': return { bg: '#95a5a6', text: 'white' };
      default: return { bg: '#95a5a6', text: 'white' };
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
          Local Assistant Dashboard - Print & Distribution
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
            {metrics.printDistribution}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Print Distribution
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
            {metrics.pending}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Pending
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
            {metrics.inProgress}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            In Progress
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

      {/* Task Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
      }}>
        {/* Pending Tasks */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#2c3e50',
            borderBottom: '2px solid #f39c12',
            paddingBottom: '0.75rem',
          }}>
            📋 Pending ({metrics.pending})
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {tasks.filter(t => t.status === 'pending').length > 0 ? (
              tasks
                .filter(t => t.status === 'pending')
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#fffacd',
                      borderLeft: `4px solid ${getTaskPriority(task.priority).bg}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#2c3e50', fontSize: '0.9rem' }}>
                      {task.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
            ) : (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '1rem', fontSize: '0.9rem' }}>
                No pending tasks
              </div>
            )}
          </div>
        </div>

        {/* In Progress Tasks */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#2c3e50',
            borderBottom: '2px solid #3498db',
            paddingBottom: '0.75rem',
          }}>
            ⚙️ In Progress ({metrics.inProgress})
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {tasks.filter(t => t.status === 'in-progress').length > 0 ? (
              tasks
                .filter(t => t.status === 'in-progress')
                .map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#e3f2fd',
                      borderLeft: `4px solid #3498db`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#2c3e50', fontSize: '0.9rem' }}>
                      {task.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
            ) : (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '1rem', fontSize: '0.9rem' }}>
                No tasks in progress
              </div>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: '#2c3e50',
            borderBottom: '2px solid #27ae60',
            paddingBottom: '0.75rem',
          }}>
            ✅ Completed ({metrics.completed})
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {tasks.filter(t => t.status === 'completed').length > 0 ? (
              tasks
                .filter(t => t.status === 'completed')
                .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#e8f5e9',
                      borderLeft: `4px solid #27ae60`,
                      borderRadius: '4px',
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#2c3e50', fontSize: '0.9rem', textDecoration: 'line-through', opacity: 0.7 }}>
                      {task.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>
                      ✓ {new Date(task.completedDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
            ) : (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '1rem', fontSize: '0.9rem' }}>
                No completed tasks yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocalAssistantDashboard;