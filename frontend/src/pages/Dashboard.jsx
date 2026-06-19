import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`card flex items-center gap-4`}>
    <div className={`text-4xl p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">🎂</div>
        <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      </div>
    </div>
  );

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">Hello, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-purple-100 text-sm">
          {data?.stats?.todayCount > 0
            ? `🎉 ${data.stats.todayCount} birthday${data.stats.todayCount > 1 ? 's' : ''} today!`
            : 'No birthdays today. Have a great day!'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="👥" label="Total Contacts" value={data?.stats?.totalContacts || 0} color="bg-purple-50 dark:bg-purple-900/20" />
        <StatCard icon="🎂" label="Today's Birthdays" value={data?.stats?.todayCount || 0} color="bg-pink-50 dark:bg-pink-900/20" />
        <StatCard icon="📅" label="Upcoming (30 days)" value={data?.stats?.upcomingCount || 0} color="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard icon="✉️" label="Wishes Sent" value={data?.stats?.sentThisYear || 0} color="bg-green-50 dark:bg-green-900/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's birthdays */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">🎂 Today's Birthdays</h3>
          </div>
          {data?.todayBirthdays?.length > 0 ? (
            <div className="space-y-3">
              {data.todayBirthdays.map(b => (
                <div key={b._id} className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                    {b.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{b.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{b.relationship} • {b.email || 'No email'}</p>
                  </div>
                  <span className="ml-auto text-2xl">🎉</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📅</p>
              <p className="text-sm">No birthdays today</p>
            </div>
          )}
        </div>

        {/* Upcoming */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">📅 Upcoming Birthdays</h3>
            <Link to="/birthdays" className="text-xs text-purple-600 hover:text-purple-700">View all →</Link>
          </div>
          {data?.upcomingBirthdays?.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingBirthdays.map(b => (
                <div key={b._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold">
                    {b.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{b.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(b.birthday)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${b.daysUntil <= 7 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                    {b.daysUntil}d
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">🎈</p>
              <p className="text-sm">No upcoming birthdays in 30 days</p>
              <Link to="/birthdays/add" className="text-xs text-purple-600 mt-2 block hover:text-purple-700">Add some contacts →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/birthdays/add" className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors text-center">
            <span className="text-2xl">➕</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Add Birthday</span>
          </Link>
          <Link to="/birthdays" className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-center">
            <span className="text-2xl">📋</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">View All</span>
          </Link>
          <Link to="/notifications" className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-center">
            <span className="text-2xl">🔔</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">History</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-2 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors text-center">
            <span className="text-2xl">⚙️</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
