import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Home, FileText, CheckCircle, DollarSign, LogOut, ChevronDown } from 'lucide-react';
import '../styles/layout.css';

function Layout({ currentUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <img src="/residence-logo.png" alt="RESIDENCE" className="sidebar-logo" />
          <h2>Resi</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>

          <div className="nav-section">
            <h3>Seller Workflows</h3>
            <Link
              to="/new-listing"
              className={`nav-item ${isActive('/new-listing') ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>New Listing</span>
            </Link>
          </div>

          <div className="nav-section">
            <h3>Landlord Workflows</h3>
            <Link
              to="/new-landlord-listing"
              className={`nav-item ${isActive('/new-landlord-listing') ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>New Rental Listing</span>
            </Link>
          </div>

          <div className="nav-section">
            <h3>Management</h3>
            <Link
              to="/tasks"
              className={`nav-item ${isActive('/tasks') ? 'active' : ''}`}
            >
              <CheckCircle size={20} />
              <span>Tasks</span>
            </Link>

            <Link
              to="/commissions"
              className={`nav-item ${isActive('/commissions') ? 'active' : ''}`}
            >
              <DollarSign size={20} />
              <span>Commissions</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1>RESIDENCE | eXp Realty</h1>
          </div>

          <div className="header-right">
            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span>{currentUser?.first_name} {currentUser?.last_name}</span>
                <ChevronDown size={16} />
              </button>

              {showUserMenu && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">
                    <span className="text-small">{currentUser?.email}</span>
                  </div>
                  <div className="dropdown-item">
                    <span className="text-small">{currentUser?.role}</span>
                  </div>
                  <hr />
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;