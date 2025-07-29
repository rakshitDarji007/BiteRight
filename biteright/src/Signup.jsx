import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    console.log("Signup attempt with:", formData);
    const simulatedUserData = {
      uid: 'user_' + Date.now(),
      name: formData.name,
      email: formData.email
    };

    login(simulatedUserData);
    localStorage.setItem('onboarding_complete_for_user_' + simulatedUserData.uid, 'false');
    alert("Signup successful! (Simulated)");
    navigate('/onboarding');
  };

  return (
     <div className="flex min-h-screen items-center justify-center p-md">
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-title-3 text-center mb-lg">Create Your Account</h2>
        {error && <div className="mb-md p-sm text-error bg-error bg-opacity-20 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-md">
            <label htmlFor="name" className="block text-subhead text-secondary mb-xs">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-secondary" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Your full name"
              />
            </div>
          </div>

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
                placeholder="Create a password"
              />
            </div>
          </div>

          <div className="mb-md">
            <label htmlFor="confirmPassword" className="block text-subhead text-secondary mb-xs">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-secondary" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Sign Up
          </button>
        </form>
        <p className="text-center text-secondary mt-md">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;