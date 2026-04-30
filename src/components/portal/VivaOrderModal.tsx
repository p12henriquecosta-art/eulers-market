import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../ui/Toast';
import type { Plan } from './portal.types';
import { track } from '../../lib/analytics';

const successGlow = keyframes`
  0% { box-shadow: 0 0 0px 0px rgba(202, 138, 4, 0); }
  50% { box-shadow: 0 0 40px 10px rgba(202, 138, 4, 0.4); }
  100% { box-shadow: 0 0 0px 0px rgba(202, 138, 4, 0); }
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(2, 4, 8, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const ModalCard = styled(motion.div)<{ $success?: boolean }>`
  width: 100%;
  max-width: 420px;
  background: var(--glass-2-bg);
  backdrop-filter: blur(var(--glass-2-blur));
  -webkit-backdrop-filter: blur(var(--glass-2-blur));
  border: 1px solid ${p => p.$success ? 'var(--color-gold)' : 'var(--glass-border)'};
  border-radius: var(--radius-xl);
  padding: 2.5rem 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.8);
  ${p => p.$success && `animation: ${successGlow} 2s ease-in-out infinite;`}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(202, 138, 4, 0.4), transparent);
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 0.88rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  line-height: 1.5;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #CA8A04;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--color-text);
  font-size: 0.95rem;
  transition: all 0.25s ease;

  &:focus {
    outline: none;
    border-color: #CA8A04;
    background: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 15px rgba(202, 138, 4, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

const ActionBtn = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 1rem;
  background: #CA8A04;
  color: #000;
  font-weight: 800;
  font-size: 0.95rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.25s var(--ease-out);
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: #EAB308;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(202, 138, 4, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1rem;
  transition: color 0.2s;

  &:hover {
    color: var(--color-text);
  }
`;

const SuccessState = styled(motion.div)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid #22C55E;
  color: #22C55E;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

interface VivaOrderModalProps {
  plan: Plan;
  onClose: () => void;
}

export const VivaOrderModal: React.FC<VivaOrderModalProps> = ({ plan, onClose }) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast('Please enter a valid email address.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/viva/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(plan.price * 100),
          customerEmail: email,
          customerName: 'Visionary Customer',
          planName: `Euler Market: ${plan.name}`,
          language: i18n.language,
          paymentNotification: true
        })
      });

      if (response.ok) {
        setSuccess(true);
        track.event('payment_initiated', { plan: plan.id, method: 'viva' });
        toast(t('portal.billing.linkSent', { email }) || `Payment link sent to ${email}`, 'success');
      } else {
        throw new Error('Failed to initiate order');
      }
    } catch (err) {
      console.error('[Viva] Modal Error:', err);
      toast('Could not initiate payment. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <Backdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ModalCard
        $success={success}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <CloseBtn onClick={onClose}>✕</CloseBtn>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <Title>Initiate Your Subscription</Title>
              <Subtitle>
                We will send a secure <strong>viva.com</strong> payment link for 
                <strong> {plan.name}</strong> to your email.
              </Subtitle>

              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label>Recipient Email</Label>
                  <Input
                    type="email"
                    placeholder="architect@euler.life"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </InputGroup>

                <ActionBtn type="submit" disabled={loading}>
                  {loading ? 'Processing...' : `Send Payment Link — €${plan.price.toFixed(2)}`}
                </ActionBtn>
              </form>
            </motion.div>
          ) : (
            <SuccessState
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <SuccessIcon>✓</SuccessIcon>
              <Title>Link Dispatched</Title>
              <Subtitle>
                The payment quest has begun. Please check <strong>{email}</strong> to complete your transaction.
              </Subtitle>
              <ActionBtn onClick={onClose}>Return to Market</ActionBtn>
            </SuccessState>
          )}
        </AnimatePresence>
      </ModalCard>
    </Backdrop>,
    document.body
  );
};
