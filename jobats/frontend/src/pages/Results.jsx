import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ATSScore from '../components/ATSScore';
import JobSuggestions from '../components/JobSuggestions';
import SkillGapAnalysis from '../components/SkillGapAnalysis';
import CareerPlan from '../components/CareerPlan';
import LoadingSpinner from '../components/LoadingSpinner';
import SavedJobs from '../components/SavedJobs';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('score');
  const [analysisData, setAnalysisData] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (location.state && location.state.analysisData) {
      setEmail(location.state.email);
      setAnalysisData(location.state.analysisData);
      localStorage.setItem('lastEmail', location.state.email);
      if (location.state.analysisData?.comparison?.delta != null) {
        const delta = location.state.analysisData.comparison.delta;
        if (delta > 0) toast.success(`ATS score improved by +${delta} points`);
        else if (delta < 0) toast.warning(`ATS score decreased by ${delta} points`);
      }
    } else {
      // Redirect to home if no data
      navigate('/');
    }
  }, [location, navigate]);

  const handlePlanGenerated = (newData) => {
    setAnalysisData(newData);
    setActiveTab('plan');
  };

  if (!analysisData) {
    return <LoadingSpinner message="Loading your results..." />;
  }

  return (
    <div className="results-container">
      <div className="container">
        <div className="results-header">
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>Your Resume Analysis Results</motion.h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
            📧 {email}
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ marginTop: '15px' }}
          >
            ← Upload New Resume
          </button>
        </div>

        <div className="results-tabs">
          <button
            className={`tab ${activeTab === 'score' ? 'active' : ''}`}
            onClick={() => setActiveTab('score')}
          >
            📊 ATS Score
          </button>
          <button
            className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            💼 Job Matches
          </button>
          <button
            className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            ⭐ Saved Jobs
          </button>
          <button
            className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            🎯 Skill Gap
          </button>
          <button
            className={`tab ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('plan')}
          >
            📈 Career Plan
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'score' && (
            <ATSScore
              score={analysisData.atsScore}
              breakdown={analysisData.scoreBreakdown}
              comparison={analysisData.comparison}
              suggestions={analysisData.improvementSuggestions}
            />
          )}

          {activeTab === 'jobs' && (
            <JobSuggestions jobs={analysisData.jobSuggestions} email={email} />
          )}

          {activeTab === 'saved' && (
            <SavedJobs email={email} />
          )}

          {activeTab === 'skills' && (
            <SkillGapAnalysis targetJob={analysisData.targetJob} />
          )}

          {activeTab === 'plan' && (
            <CareerPlan
              email={email}
              plan={analysisData.careerPlan}
              onPlanGenerated={handlePlanGenerated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
