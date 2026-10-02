import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { getCurrentUser, logout } from './utils/authUtils';

// Pages
import LoginPage from './pages/LoginPage';

// Dashboards
import AgentDashboard from './components/AgentDashboard';
import TCDashboard from './components/TCDashboard';
import MarketingManagerDashboard from './components/MarketingManagerDashboard';
import LocalAssistantDashboard from './components/LocalAssistantDashboard';
import ClosingConciergeDashboard from './components/ClosingConciergeDashboard';
import AdminDashboard from './components/AdminDashboard';

// Forms
import BuyerInputForm from './components/forms/BuyerInputForm';
import SellerListingInputForm from './components/forms/SellerListingInputForm';
import LandlordInputForm from './components/forms/LandlordInputForm';
import TenantInputForm from './components/forms/TenantInputForm';
import UserEnrollmentForm from './components/forms/UserEnrollmentForm';
import BuyerResaleUnderContractForm from './components/forms/BuyerResaleUnderContractForm';
import BuyerNewConstructionUnderContractForm from './components/forms/BuyerNewConstructionUnderContractForm';

// Task Management
import TaskList from './components/TaskList';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '1rem',
          }}>
            RESIDENCE
          </div>
          <div style={{
            color: '#7f8c8d',
          }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={setCurrentUser} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar Navigation */}
        <nav style={{
          width: '250px',
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '1.5rem 1rem',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            marginBottom: '2rem',
          }}>
            <h1 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}>
              RESIDENCE
            </h1>
            <p style={{
              margin: '0.5rem 0 0 0',
              fontSize: '0.85rem',
              opacity: 0.7,
            }}>
              eXp Realty
            </p>
          </div>

          <div style={{
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#ecf0f1',
              marginBottom: '0.5rem',
            }}>
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: '#95a5a6',
              textTransform: 'capitalize',
              marginBottom: '1rem',
            }}>
              {currentUser.role === 'tc' ? 'Transaction Coordinator' : currentUser.role === 'marketing' ? 'Marketing Manager' : currentUser.role === 'assistant' ? 'Local Assistant' : currentUser.role === 'concierge' ? 'Closing Concierge' : currentUser.role === 'admin' ? 'Admin' : 'Agent'}
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.6rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Logout
            </button>
          </div>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <NavLink to="/dashboard" label="Dashboard" />
            <NavLink to="/tasks" label="Tasks" />

            {(currentUser.role === 'agent' || currentUser.role === 'admin') && (
              <>
                <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: '1rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
                  New Transaction
                </div>
                <NavLink to="/forms/buyer" label="Buyer Input" indent />
                <NavLink to="/forms/seller" label="Seller Listing" indent />
                <NavLink to="/forms/landlord" label="Landlord Input" indent />
                <NavLink to="/forms/tenant" label="Tenant Input" indent />
              </>
            )}

            {(currentUser.role === 'agent' || currentUser.role === 'admin') && (
              <>
                <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: '1rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
                  Under Contract
                </div>
                <NavLink to="/forms/buyer-resale" label="Buyer Resale" indent />
                <NavLink to="/forms/buyer-newcon" label="Buyer New Con." indent />
              </>
            )}

            {currentUser.role === 'admin' && (
              <>
                <div style={{ fontSize: '0.8rem', color: '#95a5a6', marginTop: '1rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
                  Admin
                </div>
                <NavLink to="/forms/enrollment" label="Enroll User" indent />
              </>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main style={{
          flex: 1,
          backgroundColor: '#f5f5f5',
          overflowY: 'auto',
        }}>
          <Routes>
            {/* Dashboards */}
            <Route path="/dashboard" element={
              currentUser.role === 'agent' ? <AgentDashboard currentUser={currentUser} /> :
              currentUser.role === 'tc' ? <TCDashboard currentUser={currentUser} /> :
              currentUser.role === 'marketing' ? <MarketingManagerDashboard currentUser={currentUser} /> :
              currentUser.role === 'assistant' ? <LocalAssistantDashboard currentUser={currentUser} /> :
              currentUser.role === 'concierge' ? <ClosingConciergeDashboard currentUser={currentUser} /> :
              currentUser.role === 'admin' ? <AdminDashboard currentUser={currentUser} /> :
              <Navigate to="/login" replace />
            } />

            {/* Tasks */}
            <Route path="/tasks" element={<TaskList currentUser={currentUser} />} />

            {/* Forms */}
            <Route path="/forms/buyer" element={<BuyerInputForm currentUser={currentUser} />} />
            <Route path="/forms/seller" element={<SellerListingInputForm currentUser={currentUser} />} />
            <Route path="/forms/landlord" element={<LandlordInputForm currentUser={currentUser} />} />
            <Route path="/forms/tenant" element={<TenantInputForm currentUser={currentUser} />} />
            <Route path="/forms/buyer-resale" element={<BuyerResaleUnderContractForm currentUser={currentUser} />} />
            <Route path="/forms/buyer-newcon" element={<BuyerNewConstructionUnderContractForm currentUser={currentUser} />} />
            <Route path="/forms/enrollment" element={<UserEnrollmentForm currentUser={currentUser} />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavLink({ to, label, indent }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '0.75rem 1rem',
        color: '#ecf0f1',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '0.95rem',
        transition: 'background-color 0.2s',
        marginLeft: indent ? '1rem' : 0,
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
      }}
    >
      {label}
    </Link>
  );
}

export default App;
