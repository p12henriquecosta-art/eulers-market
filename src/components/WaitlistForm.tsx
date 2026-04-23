import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const FormWrapper = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
`;

const StatusMessage = styled(motion.p)<{ $type?: 'success' | 'error' }>`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.$type === 'success' ? '#10b981' : '#ef4444'};
`;

export const WaitlistForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // The URL is now managed in the .env file
    const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

    try {
      if (!SCRIPT_URL || SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        throw new Error('Script URL not configured');
      }
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Needed for Google Apps Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      // With 'no-cors', we can't check res.ok, but we assume success if no error is thrown
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <FormWrapper>
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <StatusMessage
            key="success"
            $type="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            ✅ You've been added to the visionary circle.
          </StatusMessage>
        ) : (
          <Form onSubmit={handleSubmit} key="form">
            <input
              type="email"
              placeholder="Enter your email for early access"
              value={email}
              required
              disabled={status === 'loading'}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Joining...' : 'Get Early Access'}
            </button>
            {status === 'error' && (
              <StatusMessage $type="error">
                Something went wrong. Please try again.
              </StatusMessage>
            )}
          </Form>
        )}
      </AnimatePresence>
    </FormWrapper>
  );
};
