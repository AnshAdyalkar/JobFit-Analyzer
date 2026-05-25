import React from 'react';

const SkillGapAnalysis = ({ targetJob }) => {
  if (!targetJob || !targetJob.title) {
    return (
      <div className="card">
        <h2>Skill Gap Analysis</h2>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>
            No skill gap analysis available yet.
          </p>
          <p style={{ fontSize: '14px' }}>
            Generate a career plan with a target job to see what skills you need to develop.
          </p>
        </div>
      </div>
    );
  }

  const hasAllSkills = !targetJob.missingSkills || targetJob.missingSkills.length === 0;

  return (
    <div className="card">
      <h2 style={{ marginBottom: '10px' }}>
        Skill Gap Analysis
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        Target Role: <strong>{targetJob.title}</strong>
      </p>

      <div className="skills-section">
        <h3>✅ Required Skills for {targetJob.title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '15px' }}>
          These skills are essential for this role
        </p>
        <div className="skills-grid">
          {targetJob.requiredSkills && targetJob.requiredSkills.length > 0 ? (
            targetJob.requiredSkills.map((skill, index) => (
              <span key={index} className="skill-tag skill-required">
                {skill}
              </span>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No required skills identified</p>
          )}
        </div>
      </div>

      <div className="skills-section">
        <h3>⚠️ Skills to Develop</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '15px' }}>
          Focus on learning these skills to strengthen your profile
        </p>
        <div className="skills-grid">
          {hasAllSkills ? (
            <div style={{
              padding: '20px',
              backgroundColor: 'var(--success-bg)',
              borderRadius: '8px',
              color: 'var(--success-color)',
              width: '100%'
            }}>
              <strong>🎉 Excellent! You have all the required skills for this role.</strong>
              <p style={{ marginTop: '10px', color: 'var(--text-primary)' }}>
                Focus on gaining more experience and building projects to showcase these skills.
              </p>
            </div>
          ) : (
            targetJob.missingSkills.map((skill, index) => (
              <span key={index} className="skill-tag skill-missing">
                {skill}
              </span>
            ))
          )}
        </div>
      </div>

      {!hasAllSkills && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: 'var(--warning-bg)',
          borderRadius: '8px',
          borderLeft: '4px solid var(--warning-color)'
        }}>
          <h4 style={{ marginBottom: '10px', color: 'var(--warning-color)' }}>📚 Learning Resources</h4>
          <ul style={{ marginLeft: '20px', color: 'var(--text-primary)', lineHeight: '1.8' }}>
            <li>Take online courses on platforms like Coursera, Udemy, or LinkedIn Learning</li>
            <li>Build personal projects to practice these skills hands-on</li>
            <li>Contribute to open-source projects on GitHub to gain real-world experience</li>
            <li>Attend workshops, webinars, and industry conferences</li>
            <li>Join communities and forums related to these technologies</li>
            <li>Read documentation and best practices for each technology</li>
            <li>Follow industry experts and thought leaders on social media</li>
          </ul>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'var(--info-bg)',
        borderRadius: '8px',
        borderLeft: '4px solid var(--primary-color)'
      }}>
        <h4 style={{ marginBottom: '10px', color: 'var(--primary-color)' }}>💡 Pro Tips</h4>
        <ul style={{ marginLeft: '20px', color: 'var(--text-primary)', lineHeight: '1.8' }}>
          <li>Create a portfolio showcasing projects using these skills</li>
          <li>Update your resume and LinkedIn profile as you learn new skills</li>
          <li>Network with professionals in your target role</li>
          <li>Consider getting certifications for high-demand skills</li>
          <li>Set a timeline and track your progress regularly</li>
        </ul>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;