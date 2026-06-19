import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const RELATIONSHIPS = ['all', 'friend', 'family', 'colleague', 'partner', 'other'];

export default function Birthdays() {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [relationship, setRelationship] = useState('all');
  const [sort, setSort] = useState('createdAt');
  const [deleteId, setDeleteId] = useState(null);

  const fetchBirthdays = async () => {
    try {
      const params = { search, relationship, sort };
      const res = await API.get('/api/birthdays', { params });
      setBirthdays(res.data.birthdays);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBirthdays(); }, [search, relationship, sort]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/birthdays/${id}`);
      setBirthdays(prev => prev.filter(b => b._id !== id));
      setDeleteId(null);
    } catch (err) {
      alert('Failed to delete. Please try again.');
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const relColors = {
    friend: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    family: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    colleague: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    partner: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Birthdays</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{birthdays.length} contacts</p>
        </div>
        <Link to="/birthdays/add" className="btn-primary text-sm">+ Add Birthday</Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            className="input-field flex-1"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="input-field sm:w-40" value={relationship} onChange={e => setRelationship(e.target.value)}>
            {RELATIONSHIPS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
          <select className="input-field sm:w-40" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="createdAt">Latest First</option>
            <option value="name">Name A-Z</option>
            <option value="birthday">By Birthday</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 animate-bounce">🎂</div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      ) : birthdays.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">🎈</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">No birthdays found</p>
          <Link to="/birthdays/add" className="btn-primary text-sm">Add your first birthday</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {birthdays.map(b => (
            <div key={b._id} className="card hover:shadow-md transition-shadow relative">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                  {b.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{b.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(b.birthday)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize flex-shrink-0 ${relColors[b.relationship]}`}>
                  {b.relationship}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                {b.email && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">📧 {b.email}</p>}
                {b.mobile && <p className="text-xs text-gray-500 dark:text-gray-400">📱 {b.mobile}</p>}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.daysUntil === 0 ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' : b.daysUntil <= 7 ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                    {b.daysUntil === 0 ? '🎉 Today!' : `${b.daysUntil} days away`}
                  </span>
                  {!b.isActive && <span className="text-xs bg-gray-100 text-gray-500 dark:bg-gray-700 px-2 py-0.5 rounded-full">Inactive</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/birthdays/edit/${b._id}`} className="flex-1 text-center text-xs py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors font-medium">
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => setDeleteId(b._id)}
                  className="flex-1 text-xs py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <p className="text-4xl text-center mb-4">🗑️</p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete Birthday?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
