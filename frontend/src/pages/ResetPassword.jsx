import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setMsg({ type: 'error', text: 'Passwords do not match' });
    if (form.password.length < 6) return setMsg({ type: 'error', text: 'Password must be at least 6 characters' });
    setLoading(true);
    try {
      await API.post('/api/auth/reset-password', { token, password: form.password });
      setMsg({ type: 'success', text: 'Password reset! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Reset failed. Link may have expired.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl">🎂</Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Enter your new password below</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {msg.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm border ${msg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200'}`}>
              {msg.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">New Password</label>
              <input type="password" className="input-field" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input type="password" className="input-field" placeholder="Repeat new password"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            <Link to="/login" className="text-purple-600 font-medium hover:text-purple-700">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
