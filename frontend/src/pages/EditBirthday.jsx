import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../api/axios';

export default function EditBirthday() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    API.get(`/api/birthdays/${id}`)
      .then(res => {
        const b = res.data.birthday;
        setForm({
          name: b.name, email: b.email || '', mobile: b.mobile || '',
          birthday: b.birthday?.split('T')[0] || '',
          relationship: b.relationship, message: b.message,
          timezone: b.timezone, imageUrl: b.imageUrl || '', isActive: b.isActive
        });
      })
      .catch(() => setError('Failed to load birthday'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setSaving(true);
    try {
      await API.put(`/api/birthdays/${id}`, form);
      setSuccess('Updated successfully! 🎉');
      setTimeout(() => navigate('/birthdays'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  if (loading) return <div className="text-center py-16"><div className="text-5xl animate-bounce">🎂</div></div>;
  if (!form) return <div className="text-center py-16 text-red-500">Birthday not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/birthdays" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm">← Back</Link>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Birthday</h2>
      </div>

      <div className="card">
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-400 rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-700 dark:text-green-400 rounded-lg text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Full Name *</label>
              <input type="text" className="input-field" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Birthday *</label>
              <input type="date" className="input-field" value={form.birthday} onChange={e => set('birthday', e.target.value)} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Mobile</label>
              <input type="tel" className="input-field" value={form.mobile} onChange={e => set('mobile', e.target.value)} />
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
            <label className="label">Birthday Message</label>
            <textarea className="input-field resize-none" rows={4} value={form.message} onChange={e => set('message', e.target.value)} />
          </div>
          <div>
            <label className="label">Photo URL</label>
            <input type="url" className="input-field" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 text-purple-600 rounded" />
            <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Active (send birthday wishes automatically)</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Link to="/birthdays" className="btn-secondary flex-1 text-center py-3">Cancel</Link>
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
              {saving ? 'Saving...' : '✅ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
