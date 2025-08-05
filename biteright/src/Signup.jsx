import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './supabaseClient';
import './index.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
    }
    if (!formData.email) {
        setError("Please enter an email address.");
        setLoading(false);
        return;
    }

    try {
      const data = await signup(formData.email, formData.password);
      console.log("Signup successful:", data);

      if (data.user && formData.name.trim() !== '') {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: data.user.id, name: formData.name.trim(), updated_at: new Date() }, { onConflict: 'id' });

        if (profileError) {
          console.error("Error creating/updating profile with name:", profileError);
        } else {
          console.log("Profile name potentially updated/created.");
        }
      }

      alert("Signup initiated! You might need to confirm your email before logging in.");
    } catch (error) {
      console.error("Signup failed:", error);
      setError(error.message || "Failed to create an account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-md">
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-title-3 text-center mb-lg">Create Your Account</h2>
        {error && <div className="mb-md p-sm text-error bg-error bg-opacity-20 rounded">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-md">
            <label htmlFor="name" className="block text-subhead text-secondary mb-xs">Name (Optional)</label>
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
                className="input-field pl-10"
                placeholder="Your full name"
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
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