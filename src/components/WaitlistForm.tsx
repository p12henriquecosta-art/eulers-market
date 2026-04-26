import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Persistence } from '../utils/persistence';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { track } from '../lib/analytics';
import { useTranslation } from 'react-i18next';

const FormWrapper = styled(motion.div)`
  max-width: 550px;
  width: 100%;
  margin: 0 auto;
  padding: 4rem 3rem;
  text-align: center;
`;

const FormTitle = styled.h3`
  font-size: 2.25rem;
  margin-bottom: 1.25rem;
  color: #fff;
  letter-spacing: -0.03em;
`;

const FormText = styled.p`
  color: var(--color-text-dim);
  margin-bottom: 3rem;
  font-size: 1.15rem;
  line-height: 1.6;
`;

const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SuccessMessage = styled(motion.div)`
  padding: 3rem 2rem;
  border-radius: 24px;
  background: rgba(0, 242, 254, 0.05);
  border: 1px solid rgba(0, 242, 254, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  h4 {
    font-size: 1.75rem;
    color: var(--color-primary);
  }

  p {
    color: var(--color-text-dim);
    font-size: 1.1rem;
    line-height: 1.5;
  }
`;

const Confetti = styled(motion.div)`
  font-size: 3rem;
`;

export const WaitlistForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState(Persistence.load('waitlist_email_draft') || '');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Persist email draft as user types
  React.useEffect(() => {
    Persistence.save('waitlist_email_draft', email);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    if (!auth.currentUser) {
      track.waitlistSignupRedirect();
      navigate('/signup');
      return;
    }

    setStatus('loading');
    
    try {
      // Real submission logic to Firestore
      await addDoc(collection(db, 'waitlist'), {
        email,
        timestamp: new Date().toISOString()
      });

      setStatus('success');
      // Extract domain only (never log the full address)
      const domain = email.split('@')[1] ?? 'unknown';
      track.waitlistJoin({ email_domain: domain });
      setEmail('');
      Persistence.remove('waitlist_email_draft');
      Persistence.save('waitlist_session', { status: 'success', timestamp: Date.now() });
    } catch (error) {
      console.error('Waitlist submission failed:', error);
      setStatus('error');
    }
  };

  return (
    <FormWrapper 
      className="glass-panel"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <SuccessMessage
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Confetti
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              🎉
            </Confetti>
            <h4>{t('waitlist.successTitle')}</h4>
            <p>{t('waitlist.successText')}</p>
            <button onClick={() => setStatus('idle')} style={{ background: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', boxShadow: 'none', padding: '0.75rem 1.5rem' }}>
              {t('waitlist.addAnother')}
            </button>
          </SuccessMessage>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FormTitle>{t('waitlist.title')}</FormTitle>
            <FormText>{t('waitlist.subtitle')}</FormText>
            
            <FormGroup onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder={t('waitlist.emailPlaceholder')} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                required
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? t('waitlist.submitting') : t('waitlist.submit')}
              </button>
            </FormGroup>
          </motion.div>
        )}
      </AnimatePresence>
    </FormWrapper>
  );
};
