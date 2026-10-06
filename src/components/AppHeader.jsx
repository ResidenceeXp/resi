import React from 'react';
import ThemeToggle from './ThemeToggle';
import './app-header.css';

const AppHeader = () => {
  return (
    <header className="app-header">
      <div className="app-header__container">
        <div className="app-header__logo-section">
          {/* RESIDENCE | eXp Logo - inline SVG */}
          <svg
            viewBox="0 0 200 200"
            className="app-header__logo"
            aria-label="RESIDENCE | eXp Realty"
          >
            <rect x="20" y="20" width="160" height="160" fill="none" stroke="#d4af37" strokeWidth="3" rx="8" />
            <circle cx="100" cy="100" r="45" fill="#d4af37" opacity="0.2" />
            <circle cx="100" cy="100" r="25" fill="#d4af37" />
            <text x="100" y="110" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold" fontFamily="Roboto, sans-serif">
              R
            </text>
          </svg>
        </div>

        <div className="app-header__actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
