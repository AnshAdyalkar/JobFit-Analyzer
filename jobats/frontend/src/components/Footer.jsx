import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2026 JobFit Analyzer. Built with React, Node.js, MongoDB & Gemini AI</p>
        <p style={{ marginTop: '10px', fontSize: '14px', opacity: '0.8' }}>
          Empowering job seekers with AI-powered resume insights
        </p>
      </div>
    </footer>
  );
};

export default Footer;