import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const RegisterPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      const response = await api.register(formData);
      const data = await response.json();

      if (data.success) {
        setToast({ message: 'Registration successful! Please login.', type: 'success' });
        setTimeout(() => onNavigate('login'), 2000);
      } else {
        setToast({ message: data.message || 'Registration failed', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <ChefHat className="text-orange-500 mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold text-gray-800">Join TastyRecipes</h2>
          <p className="text-gray-600 mt-2">Create an account to share your recipes</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            placeholder="Minimum 6 characters"
            required
          />

          <Button type="submit" variant="primary" className="w-full mb-4" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="text-orange-500 hover:underline font-semibold">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;