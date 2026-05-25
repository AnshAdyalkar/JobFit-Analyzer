import React, { useState, useEffect } from 'react';
import { getResumeHistory, deleteResume, downloadResume, getResumePreviewUrl, getProfile } from '../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const profile = await getProfile();
      const email = profile.data.email;
      setUserEmail(email);
      
      const response = await getResumeHistory(email);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load resume history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id);
        toast.success('Resume deleted successfully');
        setHistory(history.filter(item => item._id !== id));
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const ext = item.fileName.split('.').pop().toLowerCase();
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'pdf') return matchesSearch && ext === 'pdf';
    if (filterType === 'docx') return matchesSearch && ext === 'docx';
    if (filterType === 'image') return matchesSearch && ['jpg', 'jpeg', 'png'].includes(ext);
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="loader"></div>
        <p>Loading your resume history...</p>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <div className="dashboard-header">
        <h1>Resume History</h1>
        <p>Manage and track all your uploaded resumes</p>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="Search by file name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)', color: 'var(--text-primary)' }}
            />
          </div>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface)', color: 'var(--text-primary)', minWidth: '150px' }}
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF Only</option>
            <option value="docx">DOCX Only</option>
            <option value="image">Images Only</option>
          </select>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📁</div>
          <h3>No resumes found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'You haven\'t uploaded any resumes yet.'}
          </p>
        </div>
      ) : (
        <div className="history-grid">
          <AnimatePresence>
            {filteredHistory.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card history-card"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div className="history-card-icon">
                  {item.fileName.split('.').pop().toLowerCase() === 'pdf' ? '📄' : 
                   ['jpg', 'jpeg', 'png'].includes(item.fileName.split('.').pop().toLowerCase()) ? '🖼️' : '📝'}
                </div>
                <div className="history-card-content">
                  <h3 className="history-title" title={item.fileName}>{item.fileName}</h3>
                  <p className="history-date">
                    📅 {new Date(item.uploadedAt).toLocaleDateString()} at {new Date(item.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="history-email">📧 {item.email}</p>
                </div>
                
                <div className="history-actions">
                  <button 
                    onClick={() => window.open(getResumePreviewUrl(item._id), '_blank')}
                    className="btn btn-secondary btn-sm"
                    title="Preview"
                  >
                    👁️ Preview
                  </button>
                  <button 
                    onClick={() => downloadResume(item._id)}
                    className="btn btn-secondary btn-sm"
                    title="Download"
                  >
                    📥 Download
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="btn btn-danger btn-sm"
                    title="Delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <style jsx>{`
        .history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .history-card {
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: transform 0.2s;
        }
        .history-card:hover {
          transform: translateY(-5px);
        }
        .history-card-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }
        .history-title {
          font-size: 18px;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .history-date, .history-email {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        .history-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          flex-wrap: wrap;
        }
        .btn-sm {
          padding: 8px 12px;
          font-size: 13px;
          flex: 1;
          min-width: 80px;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default ResumeHistory;
