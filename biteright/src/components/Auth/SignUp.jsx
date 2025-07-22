import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Signup({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
    } catch (error) {
      setError('Failed to create an account');
    }

    setLoading(false);
  }

  return (
    <div className="apple-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 className="title-medium text-center">Create Account</h2>
      {error && <div style={{ color: 'var(--apple-red)', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--apple-border-radius)',
              border: '1px solid var(--apple-light-gray)',
              fontSize: '16px',
              fontFamily: 'Inter'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--apple-border-radius)',
              border: '1px solid var(--apple-light-gray)',
              fontSize: '16px',
              fontFamily: 'Inter'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 'var(--apple-border-radius)',
              border: '1px solid var(--apple-light-gray)',
              fontSize: '16px',
              fontFamily: 'Inter'
            }}
          />
        </div>
        
        <button disabled={loading} type="submit" className="apple-button" style={{ width: '100%' }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <span className="body-text">Already have an account? </span>
        <button 
          onClick={onSwitchToLogin}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--apple-blue)', 
            cursor: 'pointer',
            fontSize: '17px',
            fontFamily: 'Inter'
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}