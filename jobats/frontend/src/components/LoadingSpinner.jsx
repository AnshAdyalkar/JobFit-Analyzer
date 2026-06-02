import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div className="loading-spinner"></div>
      <p style={{
        marginTop: '20px',
        color: 'var(--text-secondary)',
        fontSize: '16px',
        fontWeight: '500'
      }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;