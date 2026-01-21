import React, { useState } from 'react';
import { ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await api.login(formData);
      const data = await response.json();

      if (data.success) {
        const authData = data.data;
        login({
          userId: authData.userId,
          name: authData.name,
          email: authData.email
        }, authData.token);
        setToast({ message: 'Login successful!', type: 'success' });
        setTimeout(() => onNavigate('home'), 1000);
      } else {
        setToast({ message: data.message || 'Login failed', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <ChefHat className="text-orange-500 mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-600 mt-2">Login to access your recipes</p>
        </div>

        <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            required
          />

          <Button type="submit" variant="primary" className="w-full mb-4" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('register')} className="text-orange-500 hover:underline font-semibold">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;