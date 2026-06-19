import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const params = {};
    if (filter !== 'all') params.status = filter;
    API.get('/api/notifications', { params })
      .then(res => { setNotifications(res.data.notifications); setTotal(res.data.total); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [filter]);

  const formatDate = (d) => new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification History</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{total} total notifications</p>
        </div>
        <div className="flex gap-2">
          {['all', 'success', 'failed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16"><div className="text-5xl animate-bounce">🔔</div></div>
      ) : notifications.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          <p className="text-xs text-gray-400 mt-2">Wishes will appear here after they are sent</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sent At</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map(n => (
                  <tr key={n._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold text-sm">
                          {n.contactName?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{n.contactName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{n.contactEmail || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{formatDate(n.sentAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${n.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {n.status === 'success' ? '✅' : '❌'} {n.status}
                      </span>
                      {n.error && <p className="text-xs text-red-400 mt-1 max-w-xs truncate">{n.error}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{n.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
