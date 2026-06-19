import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', senderName: user?.senderName || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await API.put('/api/profile', profile);
      updateUser(res.data.user);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully! ✅' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });
    if (passwords.newPassword !== passwords.confirm) {
      return setPassMsg({ type: 'error', text: 'New passwords do not match' });
    }
    if (passwords.newPassword.length < 6) {
      return setPassMsg({ type: 'error', text: 'Password must be at least 6 characters' });
    }
    setSavingPass(true);
    try {
      await API.put('/api/profile/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setPassMsg({ type: 'success', text: 'Password changed successfully! ✅' });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    } finally {
      setSavingPass(false);
    }
  };

  const MsgBox = ({ msg }) => msg.text ? (
    <div className={`p-3 rounded-lg text-sm mb-4 ${msg.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
      {msg.text}
    </div>
  ) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile & Settings</h2>

      {/* User info card */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{user?.name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
          {user?.isAdmin && <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">Admin</span>}
        </div>
      </div>

      {/* Update Profile */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">✏️ Update Profile</h3>
        <MsgBox msg={profileMsg} />
        <form onSubmit={handleProfile} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input-field" value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Sender Name</label>
            <input type="text" className="input-field" placeholder="Name shown in birthday emails"
              value={profile.senderName} onChange={e => setProfile({ ...profile, senderName: e.target.value })} />
            <p className="text-xs text-gray-400 mt-1">This name appears as the sender in birthday wish emails</p>
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input-field bg-gray-50 dark:bg-gray-700/50" value={user?.email} disabled />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary">
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🔐 Change Password</h3>
        <MsgBox msg={passMsg} />
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input type="password" className="input-field" placeholder="Enter current password"
              value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input-field" placeholder="Min 6 characters"
              value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} required />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input-field" placeholder="Repeat new password"
              value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} required />
          </div>
          <button type="submit" disabled={savingPass} className="btn-primary">
            {savingPass ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Email info */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📧 Email Settings</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
          Birthday wishes are sent automatically using the Gmail account configured in your server settings.
          To change the email account used for sending, update the <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env</code> file on your server.
        </p>
      </div>
    </div>
  );
}
