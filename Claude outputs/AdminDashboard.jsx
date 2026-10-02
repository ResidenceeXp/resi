import React, { useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';
import { mockTransactions } from '../data/mockTransactions';
import { mockTasks } from '../data/mockTasks';

function AdminDashboard({ currentUser }) {
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalTasks: 0,
    completedTasks: 0,
    usersByRole: {},
    transactionsByStatus: {},
  });

  useEffect(() => {
    // Calculate system-wide metrics
    const usersByRole = mockUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    const transactionsByStatus = mockTransactions.reduce((acc, txn) => {
      acc[txn.status] = (acc[txn.status] || 0) + 1;
      return acc;
    }, {});

    const completedTasksCount = mockTasks.filter(t => t.status === 'completed').length;

    setSystemMetrics({
      totalUsers: mockUsers.length,
      totalTransactions: mockTransactions.length,
      totalTasks: mockTasks.length,
      completedTasks: completedTasksCount,
      usersByRole,
      transactionsByStatus,
    });
  }, []);

  const getRoleColor = (role) => {
    const colors = {
      agent: '#3498db',
      tc: '#e74c3c',
      marketing: '#f39c12',
      assistant: '#27ae60',
      concierge: '#9b59b6',
      admin: '#2c3e50',
    };
    return colors[role] || '#95a5a6';
  };

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
      }}>
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
          System Administration
        </h1>
        <p style={{ margin: 0, color: '#7f8c8d' }}>
          Welcome, {currentUser.firstName} - System Overview & Management
        </p>
      </div>

      {/* System Metrics */}
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
            {systemMetrics.totalUsers}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Total Users
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
            {systemMetrics.totalTransactions}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Total Transactions
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
            {systemMetrics.totalTasks}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Total Tasks
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
            {systemMetrics.completedTasks}
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
        {/* Users by Role */}
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
            Users by Role
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {Object.entries(systemMetrics.usersByRole).map(([role, count]) => (
              <div key={role} style={{
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50', textTransform: 'capitalize' }}>
                  {role === 'tc' ? 'Transaction Coordinator' : role === 'marketing' ? 'Marketing Manager' : role === 'assistant' ? 'Local Assistant' : role === 'concierge' ? 'Closing Concierge' : role === 'admin' ? 'Admin' : 'Agent'}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <div
                    style={{
                      backgroundColor: getRoleColor(role),
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontWeight: '600',
                      minWidth: '50px',
                      textAlign: 'center',
                    }}
                  >
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
                      backgroundColor: getRoleColor(role),
                      height: '100%',
                      width: `${(count / systemMetrics.totalUsers) * 100}%`,
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions by Status */}
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
            Transactions by Status
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {Object.entries(systemMetrics.transactionsByStatus).map(([status, count]) => (
              <div key={status} style={{
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
              }}>
                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2c3e50', textTransform: 'capitalize' }}>
                  {status.replace(/-/g, ' ')}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <div
                    style={{
                      backgroundColor: getStatusColor(status),
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontWeight: '600',
                      minWidth: '50px',
                      textAlign: 'center',
                    }}
                  >
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
                      backgroundColor: getStatusColor(status),
                      height: '100%',
                      width: `${(count / systemMetrics.totalTransactions) * 100}%`,
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '2rem',
      }}>
        <h2 style={{
          margin: '0 0 1.5rem 0',
          color: '#2c3e50',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '1rem',
        }}>
          Team Members
        </h2>

        <div style={{
          overflowX: 'auto',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #e0e0e0', fontWeight: '600', color: '#2c3e50' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #e0e0e0', fontWeight: '600', color: '#2c3e50' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #e0e0e0', fontWeight: '600', color: '#2c3e50' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid #e0e0e0', fontWeight: '600', color: '#2c3e50' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user, idx) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #e0e0e0', backgroundColor: idx % 2 === 0 ? 'white' : '#f8f9fa' }}>
                  <td style={{ padding: '1rem', color: '#2c3e50', fontWeight: '500' }}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td style={{ padding: '1rem', color: '#7f8c8d' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: getRoleColor(user.role),
                      color: 'white',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '3px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}>
                      {user.role === 'tc' ? 'TC' : user.role === 'marketing' ? 'Marketing' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '3px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
