import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
        setError("Please fill in all fields.");
        return;
    }

    console.log("Login attempt with:", formData);
    const simulatedUserData = {
      uid: 'user_' + Date.now(),
      name: formData.email.split('@')[0],
      email: formData.email
    };

    login(simulatedUserData);

    const isOnboardingComplete = localStorage.getItem('onboarding_complete_for_user_' + simulatedUserData.uid);
    if (isOnboardingComplete === 'true') {
      console.log("Onboarding complete, navigating to dashboard.");
      navigate('/');
    } else {
      console.log("Onboarding not complete, navigating to onboarding.");
      localStorage.setItem('onboarding_complete_for_user_' + simulatedUserData.uid, 'false');
      navigate('/onboarding');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-md">
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-title-3 text-center mb-lg">Log In to Your Account</h2>
        {error && <div className="mb-md p-sm text-error bg-error bg-opacity-20 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-md">
            <label htmlFor="email" className="block text-subhead text-secondary mb-xs">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-secondary" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="mb-md">
            <label htmlFor="password" className="block text-subhead text-secondary mb-xs">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-secondary" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Your password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Log In
          </button>
        </form>
        <p className="text-center text-secondary mt-md">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;