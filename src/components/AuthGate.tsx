import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase';
import { Spinner } from './ui/Spinner';
import { track } from '../lib/analytics';
import { useTranslation } from 'react-i18next';

// ─── Error mapping ─────────────────────────────────────────────────────────────
function friendlyAuthError(code: string): string {
  const map: Record<string, string> = {
    'auth/user-not-found':           'No account found with this address.',
    'auth/invalid-credential':       'Incorrect address or passphrase.',
    'auth/wrong-password':           'Incorrect passphrase. Try again.',
    'auth/email-already-in-use':     'This address is already registered. Log in instead.',
    'auth/invalid-email':            'Invalid address format.',
    'auth/weak-password':            'Passphrase must be at least 6 characters.',
    'auth/api-key-not-valid':        'Configuration error. Contact support.',
    'auth/popup-closed-by-user':     'Sign-in was cancelled.',
    'auth/cancelled-popup-request':  'Sign-in was cancelled.',
    'auth/network-request-failed':   'Network error. Check your connection.',
    'auth/too-many-requests':        'Too many attempts. Please wait a moment.',
    'auth/account-exists-with-different-credential':
                                     'An account already exists with a different sign-in method.',
  };
  return map[code] ?? 'Authentication failed. Please try again.';
}

// ─── Styled components ─────────────────────────────────────────────────────────
const AuthWrapper = styled(motion.div)`
  max-width: 440px;
  width: 100%;
  margin: 6rem auto;
  padding: 3rem;
  text-align: center;

  @media (max-width: 640px) {
    margin: 4.5rem auto;
    padding: 2rem 1.25rem;
  }
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
  gap: 0.75rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--glass-border);
  }
`;

const ErrorText = styled.p`
  color: var(--color-error);
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

// ─── Social button ─────────────────────────────────────────────────────────────
const SocialBtn = styled.button<{ $hoverColor: string }>`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  padding: 0.78rem 1.25rem;
  font-size: 0.92rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md, 10px);
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.07);
    border-color: ${p => p.$hoverColor};
    box-shadow: 0 0 18px -4px ${p => p.$hoverColor}44;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }
`;

const SocialGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// ─── Brand SVGs ────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);


// ─── Component ─────────────────────────────────────────────────────────────────
export const AuthGate: React.FC<{ mode: 'login' | 'signup' }> = ({ mode }) => {
  const { t } = useTranslation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
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

  const handleProviderAuth = async (
    provider: typeof googleProvider | typeof githubProvider,
    method: 'google' | 'github'
  ) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      track[mode === 'login' ? 'loginComplete' : 'signupComplete']({ method });
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
        <Title>{mode === 'login' ? t('auth.loginTitle') : t('auth.signupTitle')}</Title>
        <Subtitle>
          {mode === 'login' ? t('auth.loginSubtitle') : t('auth.signupSubtitle')}
        </Subtitle>

        {error && <ErrorText>{error}</ErrorText>}

        {/* ── Social buttons ── */}
        <SocialGroup>
          <SocialBtn
            type="button"
            $hoverColor="#4285F4"
            onClick={() => handleProviderAuth(googleProvider, 'google')}
            disabled={loading}
          >
            {loading ? <Spinner size="1em" /> : <GoogleIcon />}
            {t('auth.withGoogle')}
          </SocialBtn>

          <SocialBtn
            type="button"
            $hoverColor="#ffffff"
            onClick={() => handleProviderAuth(githubProvider, 'github')}
            disabled={loading}
          >
            {loading ? <Spinner size="1em" /> : <GitHubIcon />}
            {t('auth.withGithub')}
          </SocialBtn>
        </SocialGroup>

        <Divider>{t('auth.orEmail')}</Divider>

        {/* ── Email / password ── */}
        <Form onSubmit={handleEmailAuth}>
          <input
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {loading && <Spinner size="0.95em" />}
            {loading ? t('auth.processing') : (mode === 'login' ? t('auth.loginSubmit') : t('auth.signupSubmit'))}
          </button>
        </Form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
          {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
          <a
            href={mode === 'login' ? '/signup' : '/login'}
            style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              navigate(mode === 'login' ? '/signup' : '/login');
            }}
          >
            {mode === 'login' ? t('auth.initHere') : t('auth.authHere')}
          </a>
        </p>
      </AuthWrapper>
    </main>
  );
};
