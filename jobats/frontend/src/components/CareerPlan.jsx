import React, { useState } from 'react';
import { generateCareerPlan } from '../services/api';

const CareerPlan = ({ email, plan, onPlanGenerated }) => {
  const [targetJob, setTargetJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await generateCareerPlan(email, targetJob);
      if (onPlanGenerated) {
        onPlanGenerated(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate career plan. Please try again.');
      console.error('Career plan error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format the plan text for better display
  const formatPlan = (text) => {
    if (!text) return null;

    // Split by months or major sections
    const sections = text.split(/(?=\*\*Month \d+:|Month \d+:)/g);

    return sections.map((section, index) => {
      if (!section.trim()) return null;

      // Parse section title and content
      const lines = section.split('\n').filter(line => line.trim());

      return (
        <div key={index} style={{ marginBottom: '30px' }}>
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();

            // Main month heading
            if (trimmedLine.match(/^\*\*Month \d+:/)) {
              return (
                <h3 key={lineIndex} style={{
                  color: 'var(--primary-color)',
                  fontSize: '22px',
                  marginTop: '20px',
                  marginBottom: '15px',
                  borderBottom: '2px solid var(--primary-color)',
                  paddingBottom: '8px'
                }}>
                  {trimmedLine.replace(/\*\*/g, '')}
                </h3>
              );
            }

            // Sub-headings (Goal, Activities, Deliverables)
            if (trimmedLine.match(/^\*   \*\*[^:]+:\*\*/)) {
              return (
                <h4 key={lineIndex} style={{
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  marginTop: '15px',
                  marginBottom: '10px',
                  fontWeight: '600'
                }}>
                  {trimmedLine.replace(/^\*   \*\*/g, '').replace(/\*\*/g, '')}
                </h4>
              );
            }

            // Bullet points
            if (trimmedLine.startsWith('*   ') || trimmedLine.startsWith('- ')) {
              return (
                <div key={lineIndex} style={{
                  marginLeft: '20px',
                  marginBottom: '8px',
                  lineHeight: '1.6'
                }}>
                  <span style={{ color: 'var(--primary-color)', marginRight: '10px' }}>•</span>
                  <span>{trimmedLine.replace(/^\*   |^- /, '').replace(/\*\*/g, '')}</span>
                </div>
              );
            }

            // Nested bullet points
            if (trimmedLine.match(/^    \*/)) {
              return (
                <div key={lineIndex} style={{
                  marginLeft: '40px',
                  marginBottom: '6px',
                  lineHeight: '1.6',
                  fontSize: '15px'
                }}>
                  <span style={{ color: 'var(--secondary-color)', marginRight: '8px' }}>◦</span>
                  <span>{trimmedLine.replace(/^    \*   /, '').replace(/\*\*/g, '')}</span>
                </div>
              );
            }

            // Regular paragraphs
            if (trimmedLine.length > 0) {
              return (
                <p key={lineIndex} style={{
                  marginBottom: '12px',
                  lineHeight: '1.7',
                  color: 'var(--text-primary)'
                }}>
                  {trimmedLine.replace(/\*\*/g, '')}
                </p>
              );
            }

            return null;
          })}
        </div>
      );
    });
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '10px' }}>Career Development Plan</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Get a personalized 3-month roadmap to reach your career goals
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      {!plan && (
        <form onSubmit={handleGeneratePlan}>
          <div className="input-group">
            <label htmlFor="targetJob">What's your target job role? *</label>
            <input
              type="text"
              id="targetJob"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              placeholder="e.g., Senior Software Engineer, Data Scientist, Full Stack Developer"
              required
              disabled={loading}
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '5px', display: 'block' }}>
              Be specific about the role you're aiming for
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !targetJob}
            style={{ width: '100%' }}
          >
            {loading ? '🔄 Generating Your Plan...' : '✨ Generate Career Plan'}
          </button>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'var(--info-bg)',
            borderRadius: '8px',
            fontSize: '14px',
            color: 'var(--text-primary)'
          }}>
            <strong>💡 What you'll get:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
              <li>Detailed skill gap analysis</li>
              <li>3-month learning roadmap</li>
              <li>Recommended courses and resources</li>
              <li>Project ideas to build your portfolio</li>
            </ul>
          </div>
        </form>
      )}

      {plan && (
        <div>
          <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: 'var(--success-bg)',
            borderRadius: '8px',
            borderLeft: '4px solid var(--success-color)'
          }}>
            <strong style={{ color: 'var(--success-color)' }}>✓ Plan Generated Successfully!</strong>
            <p style={{ marginTop: '5px', color: 'var(--text-primary)', fontSize: '14px' }}>
              Follow this roadmap to achieve your career goals
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--surface)',
            padding: '30px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            {formatPlan(plan)}
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => window.print()}
              className="btn btn-secondary"
            >
              🖨️ Print Plan
            </button>
            <button
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob([plan], { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = 'career-plan.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="btn btn-secondary"
            >
              📥 Download Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPlan;