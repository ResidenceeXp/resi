import React, { useState, useEffect } from 'react';
import { Home, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

function Dashboard({ currentUser }) {
  const [stats, setStats] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch dashboard stats
        const statsResponse = await fetch('/api/dashboard/stats', { headers });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch recent listings
        const listingsResponse = await fetch('/api/listings/recent', { headers });
        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json();
          setRecentListings(listingsData);
        }

        // Fetch recent transactions
        const transactionsResponse = await fetch('/api/transactions/recent', { headers });
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setRecentTransactions(transactionsData);
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {currentUser?.first_name}!</h1>
        <p className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon open-deals">
            <Home size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Open Deals</p>
            <p className="metric-value">{stats?.openDeals || 0}</p>
            <p className="metric-subtitle">Live & Under Contract</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon pending-commission">
            <DollarSign size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Pending Commission</p>
            <p className="metric-value">
              {stats?.pendingCommission ? `$${stats.pendingCommission.toLocaleString()}` : '$0'}
            </p>
            <p className="metric-subtitle">Under contract</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon live-listings">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Live Listings</p>
            <p className="metric-value">{stats?.liveListings || 0}</p>
            <p className="metric-subtitle">Active on MLS</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon pending-tasks">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <p className="metric-label">Pending Tasks</p>
            <p className="metric-value">{stats?.pendingTasks || 0}</p>
            <p className="metric-subtitle">Due soon</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/new-listing" className="action-btn new-listing">
            <Home size={18} />
            New Seller Listing
          </Link>
          <Link to="/new-landlord-listing" className="action-btn new-rental">
            <Home size={18} />
            New Rental Listing
          </Link>
          <Link to="/tasks" className="action-btn view-tasks">
            <Clock size={18} />
            View Tasks
          </Link>
          <Link to="/commissions" className="action-btn view-commissions">
            <DollarSign size={18} />
            Commission Dashboard
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="activity-section">
          <h2>Recent Listings</h2>
          {recentListings.length > 0 ? (
            <div className="activity-list">
              {recentListings.slice(0, 5).map(listing => (
                <div key={listing.id} className="activity-item">
                  <div className="activity-main">
                    <p className="activity-title">{listing.address_1}</p>
                    <p className="activity-subtitle">
                      ${listing.list_price?.toLocaleString()} • {listing.status}
                    </p>
                  </div>
                  <p className="activity-date">
                    {new Date(listing.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No recent listings</p>
          )}
        </div>

        <div className="activity-section">
          <h2>Recent Transactions</h2>
          {recentTransactions.length > 0 ? (
            <div className="activity-list">
              {recentTransactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="activity-item">
                  <div className="activity-main">
                    <p className="activity-title">
                      {transaction.address_1} - Under Contract
                    </p>
                    <p className="activity-subtitle">
                      Buyer: {transaction.buyer_first_name} {transaction.buyer_last_name}
                    </p>
                  </div>
                  <p className="activity-date">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No recent transactions</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;