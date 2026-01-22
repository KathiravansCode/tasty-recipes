import React, { useState } from 'react';
import { ChefHat, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toast from '../../components/ui/Toast';

const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const data = await api.login(formData);

      if (data.success) {
        const authData = data.data;
        login({
          userId: authData.userId,
          name: authData.name,
          email: authData.email
        }, authData.token);
        
        setToast({ message: 'Login successful! Welcome back!', type: 'success' });
        setTimeout(() => onNavigate('home'), 1000);
      }
    } catch (error) {
      setToast({ 
        message: error.message || 'Login failed. Please check your credentials.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-300 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="glass rounded-3xl shadow-2xl p-10 w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
            <ChefHat className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600">Login to access your recipes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="Enter your email"
            icon={<Mail size={20} />}
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
            placeholder="Enter your password"
            icon={<Lock size={20} />}
          />

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full" 
            loading={loading}
          >
            Login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={() => onNavigate('register')} 
              className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition-all duration-200"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;