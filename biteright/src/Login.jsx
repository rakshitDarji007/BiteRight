import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import './index.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
    }

    try {
      const data = await login(formData.email, formData.password);
      console.log("Login successful:", data);
      navigate('/');

    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
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
                placeholder="Your password"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
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