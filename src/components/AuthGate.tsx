import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Spinner } from './ui/Spinner';
import { track } from '../lib/analytics';

// ─── Friendly error mapping ────────────────────────────────────────────────────
function friendlyAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/user-not-found':         'No account found with this address.',
    'auth/invalid-credential':     'Incorrect address or passphrase.',
    'auth/wrong-password':         'Incorrect passphrase. Try again.',
    'auth/email-already-in-use':   'This address is already registered. Log in instead.',
    'auth/invalid-email':          'Invalid address format.',
    'auth/weak-password':          'Passphrase must be at least 6 characters.',
    'auth/api-key-not-valid':      'Configuration error. Contact support.',
    'auth/popup-closed-by-user':   'Google sign-in was cancelled.',
    'auth/cancelled-popup-request':'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/too-many-requests':      'Too many attempts. Please wait a moment.',
  };
  return map[code] ?? 'Authentication failed. Please try again.';
}

const AuthWrapper = styled(motion.div)`
  max-width: 440px;
  width: 100%;
  margin: 6rem auto;
  padding: 3rem;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-size: 2rem;
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  color: var(--color-text-dim);
  margin-bottom: 2.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: var(--color-text-muted);
  font-size: 0.85rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--glass-border);
  }

  &::not(:empty)::before {
    margin-right: .5em;
  }

  &::not(:empty)::after {
    margin-left: .5em;
  }
`;

const ErrorText = styled.p`
  color: var(--color-error);
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

export const AuthGate: React.FC<{ mode: 'login' | 'signup' }> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        track.loginComplete({ method: 'email' });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        track.signupComplete({ method: 'email' });
      }
      navigate('/portal');
    } catch (err: any) {
      setError(friendlyAuthError(err.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      track[mode === 'login' ? 'loginComplete' : 'signupComplete']({ method: 'google' });
      navigate('/portal');
    } catch (err: any) {
      setError(friendlyAuthError(err.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <AuthWrapper 
        className="glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Title>{mode === 'login' ? 'Authentication Gate' : 'Join the Vanguard'}</Title>
        <Subtitle>
          {mode === 'login' 
            ? 'Access your autonomous scribes.' 
            : 'Secure your identity on the market.'}
        </Subtitle>

        {error && <ErrorText>{error}</ErrorText>}

        <Form onSubmit={handleEmailAuth}>
          <input
            type="email"
            placeholder="Identity Designation (Email)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Security Passphrase"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading && <Spinner size="0.95em" />}
            {loading ? 'Processing…' : (mode === 'login' ? 'Enter Sanctuary' : 'Register Node')}
          </button>
        </Form>

        <Divider>OR</Divider>

        <button 
          type="button" 
          className="btn-secondary" 
          style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          {loading && <Spinner size="0.95em" />}
          Authenticate via Google
        </button>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem' }}>
          {mode === 'login' ? "Don't have a node?" : "Already registered?"}{' '}
          <a 
            href={mode === 'login' ? '/signup' : '/login'} 
            style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              navigate(mode === 'login' ? '/signup' : '/login');
            }}
          >
            {mode === 'login' ? 'Initialize here' : 'Authenticate here'}
          </a>
        </p>
      </AuthWrapper>
    </main>
  );
};
