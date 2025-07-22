import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (error) {
      setError('Failed to log in');
    }
    
    setLoading(false);
  }

  return (
    <div className="apple-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 className="title-medium text-center">Sign In</h2>
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
        
        <div style={{ marginBottom: '24px' }}>
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
        
        <button disabled={loading} type="submit" className="apple-button" style={{ width: '100%' }}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <span className="body-text">Don't have an account? </span>
        <button 
          onClick={onSwitchToSignup}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--apple-blue)', 
            cursor: 'pointer',
            fontSize: '17px',
            fontFamily: 'Inter'
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}