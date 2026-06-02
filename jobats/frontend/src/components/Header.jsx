import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const isAuthed = () => {
    return Boolean(localStorage.getItem('token') || sessionStorage.getItem('token'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/auth';
  };

  const navLinkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: location.pathname === path ? '700' : '500',
    opacity: location.pathname === path ? 1 : 0.8,
    transition: 'opacity 0.2s'
  });

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1>🎯 JobFit Analyzer</h1>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" style={navLinkStyle('/')}>Home</Link>
          
          {isAuthed() ? (
            <>
              <Link to="/dashboard" style={navLinkStyle('/dashboard')}>Dashboard</Link>
              <Link to="/history" style={navLinkStyle('/history')}>History</Link>
              <Link to="/profile" style={navLinkStyle('/profile')}>Profile</Link>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 14px' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" style={navLinkStyle('/auth')}>Login</Link>
          )}

          <div
            className="theme-toggle"
            style={{ background: 'transparent', border: 'none', padding: 0, marginLeft: '10px' }}
            aria-label="Theme toggle"
            title="Toggle theme"
            role="group"
          >
            <div className="theme-toggle-inner" style={{ display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '20px' }}>
              <button
                type="button"
                className={`theme-chip ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                style={{ 
                  background: theme === 'light' ? 'white' : 'transparent',
                  color: theme === 'light' ? '#6366f1' : 'white',
                  border: 'none',
                  borderRadius: '15px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ☀️
              </button>
              <button
                type="button"
                className={`theme-chip ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                style={{ 
                  background: theme === 'dark' ? 'white' : 'transparent',
                  color: theme === 'dark' ? '#6366f1' : 'white',
                  border: 'none',
                  borderRadius: '15px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🌙
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
