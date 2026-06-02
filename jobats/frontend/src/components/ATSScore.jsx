import React from 'react';
import { motion } from 'framer-motion';

const ATSScore = ({ score, breakdown, comparison, suggestions = [] }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreAdvice = (score) => {
    if (score >= 80) return 'Your resume is well-optimized for ATS systems!';
    if (score >= 60) return 'Your resume is decent but could be improved.';
    if (score >= 40) return 'Consider optimizing your resume for better ATS compatibility.';
    return 'Your resume needs significant improvements to pass ATS filters.';
  };

  return (
    <div className="card">
      <motion.h2 style={{ textAlign: 'center', marginBottom: '30px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        ATS Score Analysis
      </motion.h2>

      <div className="score-container">
        <div
          className="score-circle"
          style={{ '--score': score }}
        >
          <span className="score-value" style={{ color: getScoreColor(score) }}>
            {score}
          </span>
        </div>

        <motion.h3 style={{ color: getScoreColor(score), marginBottom: '10px' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {getScoreLabel(score)}
        </motion.h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          {getScoreAdvice(score)}
        </p>
      </div>

      {breakdown && (
        <>
          <hr style={{ margin: '40px 0', border: 'none', borderTop: '2px solid var(--border-color)' }} />

          <motion.h3 style={{ textAlign: 'center', marginBottom: '30px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Score Breakdown
          </motion.h3>

          <div className="score-breakdown">
            <div className="score-item">
              <h4>Formatting</h4>
              <div className="value">{Math.round(breakdown.formatting || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Contact info & structure
              </p>
            </div>
            <div className="score-item">
              <h4>Keywords</h4>
              <div className="value">{Math.round(breakdown.keywords || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Technical & industry terms
              </p>
            </div>
            <div className="score-item">
              <h4>Experience</h4>
              <div className="value">{Math.round(breakdown.experience || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Work history details
              </p>
            </div>
            <div className="score-item">
              <h4>Education</h4>
              <div className="value">{Math.round(breakdown.education || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Academic credentials
              </p>
            </div>
            <div className="score-item">
              <h4>Skills</h4>
              <div className="value">{Math.round(breakdown.skills || 0)}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                Listed competencies
              </p>
            </div>
          </div>
        </>
      )}

      {comparison && comparison.previousScore != null && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'var(--success-bg)',
          borderRadius: '8px',
          borderLeft: '4px solid var(--success-color)'
        }}>
          <strong>Previous score:</strong> {comparison.previousScore} | <strong>Change:</strong> {comparison.delta >= 0 ? `+${comparison.delta}` : `${comparison.delta}`}
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'var(--warning-bg)',
          borderRadius: '8px',
          borderLeft: '4px solid var(--warning-color)'
        }}>
          <h4 style={{ marginBottom: '10px', color: 'var(--warning-color)' }}>🔧 Improvement Suggestions</h4>
          <ul style={{ marginLeft: '20px', lineHeight: '1.8', color: 'var(--text-primary)' }}>
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'var(--info-bg)',
        borderRadius: '8px',
        borderLeft: '4px solid var(--primary-color)'
      }}>
        <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>💡 Quick Tips</h4>
        <ul style={{ marginLeft: '20px', color: 'var(--text-primary)', lineHeight: '1.8' }}>
          <li>Use standard section headings (Experience, Education, Skills)</li>
          <li>Include relevant keywords from job descriptions</li>
          <li>Quantify achievements with numbers and metrics</li>
          <li>Keep formatting simple and ATS-friendly</li>
          <li>Save and submit as PDF format</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} className="btn btn-secondary">🖨️ Download Feedback as PDF</button>
      </div>
    </div>
  );
};

export default ATSScore;
