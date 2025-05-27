// src/features/incentives/components/EmailSignupForm.tsx
import React, { useState } from 'react';

interface EmailSignupFormProps {
  onSubmit: (email: string, marketingConsent: boolean) => void;
  onSkip: () => void;
}

const EmailSignupForm: React.FC<EmailSignupFormProps> = ({ onSubmit, onSkip }) => {
  const [email, setEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    onSubmit(email, marketingConsent);
  };
  
  return (
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Join the DIGZOPIA Community</h2>
        <p className="text-gray-600 mt-2">
          Sign up to receive daily rewards and special offers
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">
              I agree to receive marketing emails about DIGZOPIA updates and offers
            </span>
          </label>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          >
            Get Daily Rewards
          </button>
          
          <button
            type="button"
            onClick={onSkip}
            className="w-full bg-transparent hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-md"
          >
            Skip for Now
          </button>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 text-center">
          By signing up, you agree to our Terms of Service and Privacy Policy.
          You can unsubscribe at any time.
        </p>
      </form>
    </div>
  );
};

export default EmailSignupForm;
