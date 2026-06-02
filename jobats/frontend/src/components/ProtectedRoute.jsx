import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthed = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return Boolean(token);
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthed()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;
