import React, { useState, useEffect } from 'react';
import './theme-toggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else if (newTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <div className="theme-toggle">
      <button
        className={`theme-toggle__button ${theme === 'light' ? 'active' : ''}`}
        onClick={() => handleThemeChange('light')}
        title="Light theme"
      >
        ☀️ Light
      </button>
      <button
        className={`theme-toggle__button ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => handleThemeChange('dark')}
        title="Dark theme"
      >
        🌙 Dark
      </button>
      <button
        className={`theme-toggle__button ${theme === 'system' ? 'active' : ''}`}
        onClick={() => handleThemeChange('system')}
        title="System preference"
      >
        🖥️ System
      </button>
    </div>
  );
};

export default ThemeToggle;