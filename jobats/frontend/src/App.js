import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth.jsx';
import Profile from './pages/Profile';
import ResumeHistory from './pages/ResumeHistory';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><ResumeHistory /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={2500} theme="colored" />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
