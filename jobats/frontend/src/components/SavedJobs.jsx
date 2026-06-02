import React, { useEffect, useState } from 'react';

const SavedJobs = ({ email }) => {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setSaved(existing.filter((j) => j.email === email));
    } catch {
      setSaved([]);
    }
  }, [email]);

  const removeJob = (job) => {
    try {
      const all = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const next = all.filter(
        (j) => !(j.email === email && j.title === job.title && j.reason === job.reason)
      );
      localStorage.setItem('savedJobs', JSON.stringify(next));
      setSaved(next.filter((j) => j.email === email));
    } catch {
      // ignore storage errors
    }
  };

  if (!saved || saved.length === 0) {
    return (
      <div className="card">
        <h2>Saved Jobs</h2>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⭐</div>
          <p style={{ fontSize: '16px' }}>You haven't saved any jobs yet.</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Go to Job Matches and click "Save Job" to keep interesting roles.
          </p>
        </div>
      </div>
    );
  }

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'var(--success-color)';
    if (percentage >= 60) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '10px' }}>Your Saved Jobs</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Quickly revisit roles you liked and continue your applications
      </p>

      <div className="job-list">
        {saved.map((job, idx) => (
          <div key={idx} className="job-card">
            <div className="job-header">
              <div>
                <h3 className="job-title">{job.title}</h3>
              </div>
              <span
                className="match-badge"
                style={{ backgroundColor: getMatchColor(job.matchPercentage) }}
              >
                {job.matchPercentage}% Match
              </span>
            </div>
            <p className="job-reason">
              <strong>Why this matches:</strong> {job.reason}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              <a
                href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                🔎 Search Jobs
              </a>
              <button className="btn btn-primary" onClick={() => removeJob(job)}>
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
