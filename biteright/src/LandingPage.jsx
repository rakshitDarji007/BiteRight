import React from 'react';
import { Apple } from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-md">
      <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="flex justify-center mb-md">
          <div className="bg-gray-800 p-md rounded-full">
            <Apple size={48} color="var(--color-primary)" />
          </div>
        </div>
        <h1 className="text-title-2 text-center mb-md">BiteRight</h1>
        <p className="text-subhead text-secondary text-center mb-lg">
          Personalized meal plans tailored to your goals and preferences. Powered by AI.
        </p>
        <div className="flex justify-center">
          <button className="btn btn-primary" onClick={onStart}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;