import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";

const MyProfilePage = ({ onNavigate }) => {
  const { user, token, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileForm.name || !profileForm.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (profileForm.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!profileForm.email || !profileForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      setToast({ message: 'Please fix the errors in the form', type: 'error' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Only send fields that have changed
      const updateData = {};
      if (profileForm.name !== user.name) {
        updateData.name = profileForm.name.trim();
      }
      if (profileForm.email !== user.email) {
        updateData.email = profileForm.email.trim();
      }

      // If nothing changed, just show success
      if (Object.keys(updateData).length === 0) {
        setToast({ message: 'No changes to update', type: 'info' });
        setLoading(false);
        return;
      }

      console.log('Sending update data:', updateData);
      
      const data = await api.updateProfile(updateData, token);

      console.log('Update response:', data);

      if (data.success) {
        setToast({ message: 'Profile updated successfully!', type: 'success' });
        
        // Update local user context
        updateUser({ 
          name: profileForm.name.trim(), 
          email: profileForm.email.trim() 
        });
        
        // Update form state
        setProfileForm({
          name: profileForm.name.trim(),
          email: profileForm.email.trim()
        });
      } else {
        setToast({ message: data.message || 'Update failed', type: 'error' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setToast({ message: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      setToast({ message: 'Please fix the errors in the form', type: 'error' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data = await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, token);

      if (data.success) {
        setToast({ message: 'Password changed successfully!', type: 'success' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setToast({ message: data.message || 'Password change failed', type: 'error' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setToast({ message: error.message || 'Failed to change password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const data = await api.deleteAccount(token);

      if (data.success) {
        setToast({ message: 'Account deleted successfully', type: 'success' });
        setTimeout(() => {
          logout();
          onNavigate('home');
        }, 1500);
      } else {
        setToast({ message: data.message || 'Failed to delete account', type: 'error' });
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setToast({ message: error.message || 'Failed to delete account', type: 'error' });
    } finally {
      setDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          My Profile
        </h1>

        {/* Tabs */}
        <div className="border-b mb-8 bg-white rounded-t-xl">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => { setActiveTab('profile'); setErrors({}); }}
              className={`px-4 py-4 font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'profile' 
                  ? 'border-orange-500 text-orange-500' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => { setActiveTab('password'); setErrors({}); }}
              className={`px-4 py-4 font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'password' 
                  ? 'border-orange-500 text-orange-500' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => { setActiveTab('danger'); setErrors({}); }}
              className={`px-4 py-4 font-medium border-b-2 transition-all duration-200 ${
                activeTab === 'danger' 
                  ? 'border-red-500 text-red-500' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Danger Zone
            </button>
          </div>
        </div>

        {/* Profile Info Tab */}
        {activeTab === 'profile' && (
          <div className="glass rounded-2xl p-8 shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Edit Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Enter your full name"
                error={errors.name}
                required
              />

              <Input
                label="Email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="Enter your email"
                error={errors.email}
                required
              />

              <div className="pt-4">
                <Button type="submit" variant="primary" loading={loading} className="w-full">
                  Update Profile
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="glass rounded-2xl p-8 shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <Input
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                error={errors.currentPassword}
                required
              />

              <Input
                label="New Password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password (min 6 characters)"
                error={errors.newPassword}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                error={errors.confirmPassword}
                required
              />

              <div className="pt-4">
                <Button type="submit" variant="primary" loading={loading} className="w-full">
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === 'danger' && (
          <div className="glass rounded-2xl p-8 border-2 border-red-200 shadow-xl animate-fade-in">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Danger Zone</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Once you delete your account, there is no going back. All your recipes and reviews will be permanently deleted. This action cannot be undone.
            </p>
            <Button variant="danger" onClick={() => setDeleteModal(true)}>
              <Trash2 size={20} className="inline mr-2" />
              Delete My Account
            </Button>
          </div>
        )}

        {/* Delete Account Modal */}
        <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account">
          <div className="text-center">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={40} className="text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Are you absolutely sure?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers, including:
            </p>
            <ul className="text-left text-gray-700 mb-6 space-y-2">
              <li>• All your recipes</li>
              <li>• All your reviews</li>
              <li>• Your profile information</li>
              <li>• Your account credentials</li>
            </ul>
            <div className="flex gap-3">
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
    </div>
  );
};

export default MyProfilePage;