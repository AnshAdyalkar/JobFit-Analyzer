import React, { useEffect, useMemo, useState } from 'react';
import { getAnalysisHistory, getAdminStats, getProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [email, setEmail] = useState('');
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialProfile = async () => {
      try {
        const p = await getProfile();
        if (p?.data?.email) {
          setEmail(p.data.email);
          setProfile(p.data);
        }
      } catch (e) {
        console.error('Error fetching profile:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!email) return;
      setLoading(true);
      setError('');
      try {
        const [h, s] = await Promise.all([
          getAnalysisHistory(email),
          getAdminStats()
        ]);
        setHistory(h.data || []);
        setStats(s.data || null);
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);

  const scores = useMemo(() => history.map(r => r.atsScore).reverse(), [history]);

  return (
    <div className="dashboard-container page-container">
      <div className="container">
        <div className="dashboard-header">
          <h2>Profile Dashboard</h2>
          <p>Track your resume analysis progress and app stats</p>
        </div>

        <div className="card">
          <div className="input-group">
            <label htmlFor="dashboardEmail">Your email</label>
            <input
              id="dashboardEmail"
              type="email"
              value={email}
              readOnly
              style={{ background: 'var(--light)', cursor: 'not-allowed' }}
              placeholder="Loading profile email..."
            />
            <small style={{ color: 'var(--text-secondary)', marginTop: '5px', display: 'block' }}>
              Dashboard data is automatically fetched for your account email.
            </small>
          </div>
          {loading && <div className="loading-spinner" style={{ margin: '10px auto' }} />}
          {error && <div className="alert alert-error">{error}</div>}
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Profile Completion</h3>
              <button onClick={() => navigate('/profile')} className="btn btn-secondary btn-sm">Edit</button>
            </div>
            {profile ? (
              (() => {
                const required = ['name', 'email', 'phone', 'city', 'state', 'country'];
                const optional = ['linkedin', 'github', 'skills', 'profilePhoto'];
                let filled = 0;
                required.forEach(k => { if (profile[k] && String(profile[k]).trim() !== '') filled++; });
                optional.forEach(k => { if (profile[k] && String(profile[k]).trim() !== '') filled++; });
                const total = required.length + optional.length;
                const pct = Math.round((filled / total) * 100);
                return (
                  <div>
                    <div style={{ height: '10px', background: 'var(--light)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '10px', background: 'var(--primary-color)' }} />
                    </div>
                    <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>{pct}% complete</p>
                  </div>
                );
              })()
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No profile data yet.</p>
            )}
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Resume Upload History</h3>
              <button onClick={() => navigate('/history')} className="btn btn-secondary btn-sm">Manage All</button>
            </div>
            {history.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No analysis history yet. Upload your resume to get started.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ padding: '8px' }}>Date</th>
                      <th style={{ padding: '8px' }}>Score</th>
                      <th style={{ padding: '8px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 5).map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px' }}>{new Date(item.analyzedAt || item.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '8px' }}>
                          <span style={{ 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            background: item.atsScore >= 70 ? 'var(--success-bg)' : 'var(--warning-bg)',
                            color: item.atsScore >= 70 ? 'var(--success-color)' : 'var(--warning-color)',
                            fontSize: '13px',
                            fontWeight: 'bold'
                          }}>
                            {item.atsScore}
                          </span>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <button 
                            onClick={() => navigate('/results', { state: { email, analysisData: item } })}
                            className="btn-text"
                            style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {history.length > 5 && (
                  <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    <button onClick={() => navigate('/history')} className="btn-text" style={{ color: 'var(--primary-color)', cursor: 'pointer', background: 'none', border: 'none' }}>
                      Show more history...
                    </button>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {stats && (
          <div className="card" style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>Platform Statistics</h3>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
              <div className="stat-item" style={{ textAlign: 'center', padding: '15px', background: 'var(--light)', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalUsers || 0}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Users</div>
              </div>
              <div className="stat-item" style={{ textAlign: 'center', padding: '15px', background: 'var(--light)', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success-color)' }}>{stats.totalResumes || 0}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Resumes Analyzed</div>
              </div>
              <div className="stat-item" style={{ textAlign: 'center', padding: '15px', background: 'var(--light)', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary-color)' }}>{stats.totalAnalyses || 0}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Analyses Generated</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .btn-sm {
          padding: 5px 12px;
          font-size: 13px;
        }
        .btn-text:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
