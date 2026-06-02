import React, { useState, useEffect } from 'react';
import { uploadResume, analyzeResume, getProfile } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const profile = await getProfile();
        if (profile?.data?.email) {
          setEmail(profile.data.email);
        }
      } catch (err) {
        console.error('Error fetching profile for email:', err);
      }
    };
    fetchUserEmail();
  }, []);

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const isValidFile = (file) => {
    if (!file) return false;
    return allowedTypes.includes(file.type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (isValidFile(droppedFile)) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Invalid file type. Allowed: PDF, JPG, PNG, DOCX');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (isValidFile(selectedFile)) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Invalid file type. Allowed: PDF, JPG, PNG, DOCX');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !file) {
      setError('Please provide email and upload a resume');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('resume', file);

      await uploadResume(formData);
      setSuccess('Resume uploaded successfully! Analyzing...');
      toast.success('Resume uploaded successfully');

      // Automatically analyze the resume
      const analysisResponse = await analyzeResume(email);
      toast.info('Analysis complete');

      // Call parent callback with results
      if (onUploadSuccess) {
        onUploadSuccess(email, analysisResponse.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume. Please try again.');
      console.error('Upload error:', err);
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Upload Your Resume</h2>
          <button 
            onClick={() => navigate('/history')} 
            className="btn btn-secondary" 
            style={{ padding: '8px 15px', fontSize: '14px' }}
          >
            📜 View History
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            {success}
            <button 
              onClick={() => navigate('/history')} 
              style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', marginLeft: '10px', fontWeight: 'bold' }}
            >
              Check History
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={loading}
              readOnly={!!email} // Prevent changing email if it was auto-filled from profile
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '5px', display: 'block' }}>
              Your resume will be saved under this email for your history.
            </small>
          </div>

          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !loading && document.getElementById('fileInput').click()}
            style={{ cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            <div className="drop-zone-icon">📄</div>
            <h3>Drag & Drop your resume here</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '10px 0' }}>or click to browse</p>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Allowed: PDF, DOCX, JPG, PNG (Max 10MB)</p>
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.docx,.jpg,.jpeg,.png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {file && (
            <div className="file-info">
              <strong>✓ Selected File:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !file || !email}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {loading ? '🔄 Analyzing Resume...' : '🚀 Upload & Analyze Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUpload;
