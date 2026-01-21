import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

const MyProfilePage = ({ onNavigate }) => {
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.updateProfile(profileForm, token);
      const data = await response.json();

      if (data.success) {
        setToast({ message: 'Profile updated successfully', type: 'success' });
        const updatedUser = { ...user, name: profileForm.name, email: profileForm.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setToast({ message: data.message || 'Update failed', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, token);
      const data = await response.json();

      if (data.success) {
        setToast({ message: 'Password changed successfully', type: 'success' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setToast({ message: data.message || 'Password change failed', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await api.deleteAccount(token);
      const data = await response.json();

      if (data.success) {
        setToast({ message: 'Account deleted successfully', type: 'success' });
        setTimeout(() => {
          logout();
          onNavigate('home');
        }, 1500);
      } else {
        setToast({ message: 'Failed to delete account', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred', type: 'error' });
    } finally {
      setDeleteModal(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      {/* Tabs */}
      <div className="border-b mb-8">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'profile' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'password' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`px-4 py-2 font-medium border-b-2 transition ${activeTab === 'danger' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            Danger Zone
          </button>
        </div>
      </div>

      {/* Profile Info Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Profile Information</h2>
          <form onSubmit={handleUpdateProfile}>
            <Input
              label="Full Name"
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              placeholder="Enter your email"
              required
            />

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-2xl font-bold mb-6">Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <Input
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="Enter new password (min 6 characters)"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              required
            />

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </form>
        </div>
      )}

      {/* Danger Zone Tab */}
      {activeTab === 'danger' && (
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Danger Zone</h2>
          <p className="text-gray-700 mb-6">
            Once you delete your account, there is no going back. All your recipes and reviews will be permanently deleted.
          </p>
          <Button variant="danger" onClick={() => setDeleteModal(true)}>
            Delete My Account
          </Button>
        </div>
      )}

      {/* Delete Account Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account">
        <div className="text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Are you absolutely sure?</h3>
          <p className="text-gray-600 mb-6">
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </p>
          <div className="flex gap-2">
            <Button variant="danger" onClick={handleDeleteAccount} className="flex-1">
              Yes, Delete My Account
            </Button>
            <Button variant="secondary" onClick={() => setDeleteModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyProfilePage;