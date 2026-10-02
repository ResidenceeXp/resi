import React, { useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockTransactions';
import { mockTasks, getTasksByAssignee, getUpcomingTasks, getOverdueTasks } from '../data/mockTasks';

function AgentDashboard({ currentUser }) {
  const [agentTransactions, setAgentTransactions] = useState([]);
  const [agentTasks, setAgentTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [metrics, setMetrics] = useState({
    ytdClosed: 0,
    ytdCommission: 0,
    underContract: 0,
    liveListings: 0,
  });
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Get agent's transactions
    const transactions = mockTransactions.filter(t => t.agent === currentUser.id);
    setAgentTransactions(transactions);

    // Get agent's tasks
    const tasks = getTasksByAssignee(currentUser.id);
    setAgentTasks(tasks);

    // Get upcoming tasks
    setUpcomingTasks(getUpcomingTasks(7));

    // Calculate metrics
    const closed = transactions.filter(t => t.status === 'closed').length;
    const commission = transactions
      .filter(t => t.status === 'closed')
      .reduce((sum, t) => sum + (t.commission || 0), 0);
    const underContract = transactions.filter(t => t.status === 'under-contract').length;
    const listings = transactions.filter(t => t.type === 'seller' && t.status === 'listing-active').length;

    setMetrics({
      ytdClosed: closed,
      ytdCommission: commission,
      underContract: underContract,
      liveListings: listings,
    });
  }, [currentUser]);

  const filteredTransactions = filterStatus === 'all'
    ? agentTransactions
    : agentTransactions.filter(t => t.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'closed': return '#27ae60';
      case 'under-contract': return '#f39c12';
      case 'pending': return '#3498db';
      case 'listing-active': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {currentUser.firstName}!</h1>
        <p>Agent Dashboard - Your Transactions & Tasks</p>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{metrics.ytdClosed}</div>
          <div className="metric-label">YTD Closed</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">${(metrics.ytdCommission / 1000).toFixed(0)}K</div>
          <div className="metric-label">YTD Commission</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.underContract}</div>
          <div className="metric-label">Under Contract</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{metrics.liveListings}</div>
          <div className="metric-label">Live Listings</div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Transactions Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Transactions</h2>
            <div className="filter-controls">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under-contract">Under Contract</option>
                <option value="listing-active">Listing Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <table className="transactions-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Status</th>
                <th>Closing Date</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(t => (
                  <tr key={t.id}>
                    <td className="property-cell">
                      <strong>{t.propertyAddress}</strong><br/>
                      <small>{t.propertyCity}, {t.county}</small>
                    </td>
                    <td>{t.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(t.status) }}>
                        {t.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                    </td>
                    <td>{t.closingDate || t.listingDate || 'N/A'}</td>
                    <td className="commission-cell">${t.commission ? t.commission.toLocaleString() : 'TBD'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tasks Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Tasks</h2>
            <span className="task-count">{agentTasks.length} tasks</span>
          </div>

          <div className="tasks-list">
            {agentTasks.length > 0 ? (
              agentTasks
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .slice(0, 10)
                .map(task => (
                  <div key={task.id} className="task-item">
                    <div className="task-info">
                      <div className="task-description">{task.description}</div>
                      <div className="task-meta">
                        Due: {new Date(task.dueDate).toLocaleDateString()} |
                        Status: <span className={`task-status ${task.status}`}>{task.status}</span>
                      </div>
                    </div>
                    <div className="task-priority">
                      <span className={`priority ${task.priority}`}>{task.priority.toUpperCase()}</span>
                    </div>
                  </div>
                ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                No tasks assigned
              </div>
            )}
          </div>

          {agentTasks.length > 10 && (
            <div style={{ textAlign: 'center', marginTop: '1rem', color: '#3498db' }}>
              <a href="#tasks" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                View all {agentTasks.length} tasks →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Deadlines Alert */}
      {upcomingTasks.length > 0 && (
        <div className="dashboard-section alert-section">
          <h2>⚠️ Upcoming Deadlines This Week</h2>
          <div className="deadlines-list">
            {upcomingTasks.slice(0, 5).map(task => (
              <div key={task.id} className="deadline-item">
                <div className="deadline-date">
                  {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="deadline-task">{task.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
        }

        .dashboard-header {
          margin-bottom: 2rem;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 1rem;
        }

        .dashboard-header h1 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .metric-value {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .dashboard-section {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 1rem;
        }

        .section-header h2 {
          margin: 0;
          color: #2c3e50;
        }

        .task-count {
          background: #ecf0f1;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #7f8c8d;
        }

        .filter-controls select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .transactions-table th {
          text-align: left;
          padding: 1rem;
          background: #f8f9fa;
          border-bottom: 2px solid #e0e0e0;
          font-weight: 600;
          color: #2c3e50;
        }

        .transactions-table td {
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .transactions-table tr:hover {
          background: #f8f9fa;
        }

        .property-cell {
          font-weight: 500;
        }

        .property-cell small {
          display: block;
          color: #7f8c8d;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .status-badge {
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .commission-cell {
          font-weight: 600;
          color: #27ae60;
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .task-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1rem;
          background: #f8f9fa;
          border-left: 4px solid #3498db;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .task-item:hover {
          background: #ecf0f1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .task-info {
          flex: 1;
        }

        .task-description {
          font-weight: 500;
          color: #2c3e50;
          margin-bottom: 0.25rem;
        }

        .task-meta {
          font-size: 0.85rem;
          color: #7f8c8d;
        }

        .task-status {
          font-weight: 600;
          padding: 0.2rem 0.4rem;
          border-radius: 2px;
        }

        .task-status.pending {
          color: #f39c12;
        }

        .task-status.completed {
          color: #27ae60;
        }

        .task-status['in-progress'] {
          color: #3498db;
        }

        .task-priority {
          display: flex;
          align-items: center;
        }

        .priority {
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .priority.high {
          background: #e74c3c;
          color: white;
        }

        .priority.medium {
          background: #f39c12;
          color: white;
        }

        .priority.low {
          background: #95a5a6;
          color: white;
        }

        .alert-section {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
        }

        .alert-section h2 {
          color: #856404;
          margin-top: 0;
        }

        .deadlines-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .deadline-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: white;
          border-radius: 4px;
        }

        .deadline-date {
          min-width: 50px;
          font-weight: 600;
          color: #e74c3c;
          text-align: center;
        }

        .deadline-task {
          color: #2c3e50;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default AgentDashboard;
