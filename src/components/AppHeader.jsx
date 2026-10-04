import React from 'react';
import ThemeToggle from './ThemeToggle';
import './app-header.css';

const AppHeader = () => {
  return (
    <header className="app-header">
      <div className="app-header__container">
        <div className="app-header__logo-section">
          {/* Resi Logo - uses the image in public/residence-logo.png */}
          <img
            src="/residence-logo.png"
            alt="Resi - RESIDENCE | eXp Realty"
            className="app-header__logo"
          />
          <div className="app-header__title">
            <h1>Resi</h1>
            <p>Transaction Management</p>
          </div>
        </div>

        <div className="app-header__actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;