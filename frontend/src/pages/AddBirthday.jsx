import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const defaultForm = {
  name: '', birthday: '', email: '', mobile: '',
  relationship: 'friend', message: 'Wishing you a wonderful birthday filled with joy and happiness! 🎂',
  timezone: 'Asia/Kolkata', imageUrl: '', isActive: true
};

export default function AddBirthday() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await API.post('/api/birthdays', form);
      setSuccess('Birthday added successfully! 🎉');
      setTimeout(() => navigate('/birthdays'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add birthday');
    } finally {
      setLoading(false);
    }
  };

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/birthdays" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">← Back</Link>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Birthday</h2>
      </div>

      <div className="card">
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Full Name *</label>
              <input type="text" className="input-field" placeholder="e.g. Rahul Sharma" value={form.name}
                onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Birthday *</label>
              <input type="date" className="input-field" value={form.birthday}
                onChange={e => set('birthday', e.target.value)} required />
            </div>
            <div>
              <label className="label">Email (for wishes)</label>
              <input type="email" className="input-field" placeholder="friend@gmail.com" value={form.email}
                onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <input type="tel" className="input-field" placeholder="9876543210" value={form.mobile}
                onChange={e => set('mobile', e.target.value)} />
            </div>
            <div>
              <label className="label">Relationship</label>
              <select className="input-field" value={form.relationship} onChange={e => set('relationship', e.target.value)}>
                <option value="friend">👫 Friend</option>
                <option value="family">👨‍👩‍👧 Family</option>
                <option value="colleague">💼 Colleague</option>
                <option value="partner">❤️ Partner</option>
                <option value="other">🌟 Other</option>
              </select>
            </div>
            <div>
              <label className="label">Timezone</label>
              <select className="input-field" value={form.timezone} onChange={e => set('timezone', e.target.value)}>
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="America/New_York">New York (EST)</option>
                <option value="America/Los_Angeles">Los Angeles (PST)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Asia/Singapore">Singapore (SGT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Custom Birthday Message</label>
            <textarea className="input-field resize-none" rows={4} placeholder="Write a personal birthday message..."
              value={form.message} onChange={e => set('message', e.target.value)} />
            <p className="text-xs text-gray-400 mt-1">{form.message.length}/1000 characters</p>
          </div>

          <div>
            <label className="label">Photo URL (optional)</label>
            <input type="url" className="input-field" placeholder="https://example.com/photo.jpg" value={form.imageUrl}
              onChange={e => set('imageUrl', e.target.value)} />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={form.isActive}
              onChange={e => set('isActive', e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded" />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
              Active (send birthday wishes automatically)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/birthdays" className="btn-secondary flex-1 text-center py-3">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? 'Saving...' : '🎂 Add Birthday'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
