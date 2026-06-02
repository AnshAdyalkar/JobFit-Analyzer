import React, { useEffect, useMemo, useState } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    linkedin: '',
    github: '',
    skills: '',
    profilePhoto: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getProfile();
        const u = res.data || {};
        setForm({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          city: u.city || '',
          state: u.state || '',
          country: u.country || '',
          linkedin: u.linkedin || '',
          github: u.github || '',
          skills: (u.skills || []).join(', '),
          profilePhoto: u.profilePhoto || ''
        });
      } catch (e) {
        toast.error(e.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const completion = useMemo(() => {
    const required = ['name', 'email', 'phone', 'city', 'state', 'country'];
    const optional = ['linkedin', 'github', 'skills', 'profilePhoto'];
    let filled = 0;
    required.forEach(k => { if (form[k] && form[k].trim() !== '') filled++; });
    optional.forEach(k => { if (form[k] && form[k].trim() !== '') filled++; });
    const total = required.length + optional.length;
    return Math.round((filled / total) * 100);
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        city: form.city,
        state: form.state,
        country: form.country,
        linkedin: form.linkedin,
        github: form.github,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        profilePhoto: form.profilePhoto
      };
      const res = await updateProfile(payload);
      toast.success('Profile updated');
      const u = res.data || {};
      setForm(prev => ({ ...prev, email: u.email || prev.email }));
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h2>Profile</h2>
          <p>Manage your personal information</p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Profile completion:</strong> {completion}%
              <div style={{ height: '10px', background: 'var(--light)', borderRadius: '999px', marginTop: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${completion}%`, height: '10px', background: 'var(--primary-color)' }} />
              </div>
            </div>
            <a href="/dashboard" className="btn btn-secondary">Dashboard</a>
          </div>
        </div>
        <div className="card">
          {loading && <div className="loading-spinner" />}
          <form onSubmit={save}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" value={form.name} onChange={onChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} readOnly />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="text" value={form.phone} onChange={onChange} />
            </div>
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" value={form.city} onChange={onChange} />
            </div>
            <div className="input-group">
              <label htmlFor="state">State</label>
              <input id="state" name="state" type="text" value={form.state} onChange={onChange} />
            </div>
            <div className="input-group">
              <label htmlFor="country">Country</label>
              <input id="country" name="country" type="text" value={form.country} onChange={onChange} />
            </div>
            <div className="input-group">
              <label htmlFor="linkedin">LinkedIn Profile</label>
              <input id="linkedin" name="linkedin" type="url" value={form.linkedin} onChange={onChange} />
            </div>
            <div className="input-group">
              <label htmlFor="github">GitHub Profile</label>
              <input id="github" name="github" type="url" value={form.github} onChange={onChange} />
            </div>
            <div className="input-group">
              <label htmlFor="skills">Skills (comma separated)</label>
              <input id="skills" name="skills" type="text" value={form.skills} onChange={onChange} />
            </div>
            <div className="input-group">
              <label htmlFor="profilePhoto">Profile Photo URL (optional)</label>
              <input id="profilePhoto" name="profilePhoto" type="url" value={form.profilePhoto} onChange={onChange} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>Save Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
