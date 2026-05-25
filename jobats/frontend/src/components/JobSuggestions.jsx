import React, { useEffect, useMemo, useState } from 'react';

const JobSuggestions = ({ jobs, email }) => {
  const [filterKeyword, setFilterKeyword] = useState('');
  const [minMatch, setMinMatch] = useState(60);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setSavedJobs(existing);
    } catch {
      setSavedJobs([]);
    }
  }, []);

  const isSaved = (job) => {
    return savedJobs.some(
      (j) => j.email === email && j.title === job.title && j.reason === job.reason
    );
  };

  const toggleSave = (job) => {
    try {
      const current = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const keyMatch = (j) =>
        j.email === email && j.title === job.title && j.reason === job.reason;
      let next;
      if (current.some(keyMatch)) {
        next = current.filter((j) => !keyMatch(j));
      } else {
        next = [
          ...current,
          { email, title: job.title, matchPercentage: job.matchPercentage, reason: job.reason },
        ];
      }
      localStorage.setItem('savedJobs', JSON.stringify(next));
      setSavedJobs(next);
    } catch {
      // ignore storage errors
    }
  };

  const filteredJobs = useMemo(() => {
    const kw = filterKeyword.trim().toLowerCase();
    return (jobs || []).filter((job) => {
      const matchOk = Number(job.matchPercentage || 0) >= Number(minMatch);
      const textOk =
        kw.length === 0 ||
        (job.title || '').toLowerCase().includes(kw) ||
        (job.reason || '').toLowerCase().includes(kw);
      return matchOk && textOk;
    });
  }, [jobs, filterKeyword, minMatch]);

  if (!jobs || jobs.length === 0) {
    return (
      <div className="card">
        <h2>Job Suggestions</h2>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💼</div>
          <p style={{ fontSize: '16px' }}>No job suggestions available yet.</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Upload and analyze your resume to get personalized job recommendations.
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
      <h2 style={{ marginBottom: '10px' }}>Recommended Jobs for You</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Based on your skills and experience, here are the best job matches
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 240px',
        gap: '12px',
        alignItems: 'end',
        marginBottom: '20px'
      }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label htmlFor="keyword">Filter by keyword</label>
          <input
            id="keyword"
            type="text"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="e.g., frontend, backend, data"
          />
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label htmlFor="minMatch">Minimum match: {minMatch}%</label>
          <input
            id="minMatch"
            type="range"
            min="0"
            max="100"
            step="5"
            value={minMatch}
            onChange={(e) => setMinMatch(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '10px' }}>
        Showing {filteredJobs.length} of {jobs.length} jobs
      </div>

      <div className="job-list">
        {filteredJobs.map((job, index) => (
          <div key={index} className="job-card">
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
              <button
                className="btn btn-primary"
                onClick={() => toggleSave(job)}
              >
                {isSaved(job) ? '⭐ Saved' : '☆ Save Job'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'var(--success-bg)',
        borderRadius: '8px',
        borderLeft: '4px solid var(--success-color)'
      }}>
        <h4 style={{ marginBottom: '10px', color: 'var(--success-color)' }}>✨ Next Steps</h4>
        <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
          Ready to apply? Tailor your resume for each position by incorporating specific keywords
          and highlighting relevant experiences. Consider generating a career development plan
          for your target role!
        </p>
      </div>
    </div>
  );
};

export default JobSuggestions;
