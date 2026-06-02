import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  const handleUploadSuccess = (email, analysisData) => {
    navigate('/results', { state: { email, analysisData } });
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="hero-section">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get Your Resume ATS-Ready
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Upload your resume and get instant ATS score, job suggestions,
            and a personalized career development plan powered by AI
          </motion.p>
        </div>

        <ResumeUpload onUploadSuccess={handleUploadSuccess} />

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>ATS Score Analysis</h3>
            <p>Get detailed analysis of how well your resume performs with Applicant Tracking Systems</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Job Matching</h3>
            <p>AI-powered job suggestions tailored to your skills and experience using Google Gemini</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Skill Gap Analysis</h3>
            <p>Identify missing skills for your target job role and get actionable insights</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Career Roadmap</h3>
            <p>Get a personalized 3-month development plan to reach your career goals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
