import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { createPortal } from 'react-dom';
import type { Plan } from './portal.types';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

// ─── Wallet registry ──────────────────────────────────────────────────────────
const WALLETS = [
  {
    id: 'btc',
    label: 'Bitcoin',
    ticker: 'BTC',
    address: 'bc1qcsjkseys95s2jw0avl5akstht6p0ax4y7y72tv',
    color: '#F7931A',
    glow: 'rgba(247,147,26,0.18)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#F7931A" opacity="0.15" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#F7931A" fontSize="18" fontWeight="700">₿</text>
      </svg>
    ),
    note: 'Native SegWit (bech32). Minimum 0.00001 BTC.',
  },
  {
    id: 'xrp',
    label: 'Ripple',
    ticker: 'XRP',
    address: 'r4PXVvqUievZPJZ5oisyFaHA4HppEU88sV',
    color: '#00AAE4',
    glow: 'rgba(0,170,228,0.18)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#00AAE4" opacity="0.15" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#00AAE4" fontSize="13" fontWeight="700">XRP</text>
      </svg>
    ),
    note: 'XRP Ledger. No destination tag required.',
  },
  {
    id: 'usdc',
    label: 'USDC',
    ticker: 'USDC',
    address: '0x34704a78CfC751dd709BE6A69420461bDBf6a467',
    color: '#2775CA',
    glow: 'rgba(39,117,202,0.18)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#2775CA" opacity="0.15" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#2775CA" fontSize="11" fontWeight="700">USDC</text>
      </svg>
    ),
    note: 'ERC-20 on Ethereum Mainnet only. Do not send from other chains.',
  },
];

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(32px) scale(0.98) } to { opacity: 1; transform: translateY(0) scale(1) }`;

// ─── Styled components ────────────────────────────────────────────────────────
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(2, 4, 8, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 520px;
  background: rgba(8, 14, 22, 0.95);
  border: 1px solid rgba(0, 242, 254, 0.14);
  border-radius: 20px;
  box-shadow:
    0 0 0 1px rgba(0,242,254,0.06),
    0 32px 80px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.05);
  animation: ${slideUp} 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1.6rem 1.75rem 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ModalTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.02em;
  margin: 0 0 0.2rem;
`;

const ModalSubtitle = styled.p`
  font-size: 0.78rem;
  color: var(--color-text-muted);
  margin: 0;
`;

const CloseBtn = styled.button`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-dim);
  font-size: 1rem;
  padding: 0;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(255,255,255,0.1);
    color: var(--color-text);
  }
`;

const TabRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1.25rem 1.75rem 0;
`;

const Tab = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  ${({ $active, $color }) =>
    $active
      ? css`
          background: ${$color}18;
          border-color: ${$color}40;
          color: ${$color};
          box-shadow: 0 0 12px ${$color}22;
        `
      : css`
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.06);
          color: var(--color-text-dim);

          &:hover {
            background: rgba(255,255,255,0.07);
            color: var(--color-text);
          }
        `}
`;

const Body = styled.div`
  padding: 1.25rem 1.75rem 1.75rem;
`;

const WalletBox = styled.div<{ $color: string; $glow: string }>`
  background: rgba(0,0,0,0.35);
  border: 1px solid ${({ $color }) => $color}28;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 0 0 24px ${({ $glow }) => $glow};
  transition: box-shadow 0.3s;
`;

const WalletLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
`;

const AddressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const Address = styled.span`
  font-family: var(--font-mono, 'Courier New', monospace);
  font-size: 0.78rem;
  color: var(--color-text);
  word-break: break-all;
  line-height: 1.5;
  flex: 1;
  letter-spacing: 0.03em;
`;

const CopyBtn = styled.button<{ $copied: boolean; $color: string }>`
  padding: 0.4rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 7px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;
  cursor: pointer;

  ${({ $copied, $color }) =>
    $copied
      ? css`
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.4);
          color: #22C55E;
          box-shadow: 0 0 12px rgba(34,197,94,0.2);
        `
      : css`
          background: ${$color}14;
          border: 1px solid ${$color}30;
          color: ${$color};

          &:hover {
            background: ${$color}22;
            box-shadow: 0 0 14px ${$color}28;
          }
        `}
`;

const Note = styled.p<{ $color: string }>`
  font-size: 0.76rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0 0 1.1rem;
  padding: 0.65rem 0.85rem;
  background: ${({ $color }) => $color}0a;
  border-left: 2px solid ${({ $color }) => $color}50;
  border-radius: 0 6px 6px 0;
`;

const PlanTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.76rem;
  font-weight: 600;
  background: rgba(0,242,254,0.08);
  border: 1px solid rgba(0,242,254,0.18);
  color: var(--color-primary);
  margin-bottom: 1.1rem;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 1.25rem 0;
`;

const ProofSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProofLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.01em;
`;

const ProofInputRow = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const ProofInput = styled.input`
  flex: 1;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 0.6rem 0.85rem;
  color: var(--color-text);
  font-size: 0.85rem;
  font-family: var(--font-mono, 'Courier New', monospace);
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-text-muted);
    font-family: var(--font-sans);
  }

  &:focus {
    outline: none;
    border-color: rgba(0,242,254,0.4);
    background: rgba(0,242,254,0.03);
  }
`;

const SubmitBtn = styled.button`
  background: var(--color-primary);
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 0 1.25rem;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,242,254,0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessState = styled.div`
  padding: 1rem;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: 8px;
  color: #22C55E;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  plan: Plan;
  onClose: () => void;
}

export const CryptoPaymentModal: React.FC<Props> = ({ plan, onClose }) => {
  const [activeId, setActiveId] = useState('btc');
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const wallet = WALLETS.find(w => w.id === activeId) ?? WALLETS[0];

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(wallet.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [wallet.address]);

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) return;

    setStatus('loading');

    try {
      // In production, user will be logged in if they are on this portal.
      // But we check just to be safe.
      const user = auth.currentUser;
      
      await addDoc(collection(db, 'crypto_payments'), {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'unknown',
        planId: plan.id,
        planName: plan.name,
        currency: wallet.ticker,
        txHash: txHash.trim(),
        timestamp: new Date().toISOString(),
        status: 'pending_verification'
      });

      setStatus('success');
    } catch (err) {
      console.error('Failed to submit proof:', err);
      setStatus('error');
    }
  };

  // Reset copy state when tab changes
  useEffect(() => { setCopied(false); }, [activeId]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <Backdrop onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <ModalTitle>Pay with Cryptocurrency</ModalTitle>
            <ModalSubtitle>Send the exact amount to the address below</ModalSubtitle>
          </div>
          <CloseBtn onClick={onClose} aria-label="Close">✕</CloseBtn>
        </ModalHeader>

        <TabRow>
          {WALLETS.map(w => (
            <Tab
              key={w.id}
              $active={activeId === w.id}
              $color={w.color}
              onClick={() => setActiveId(w.id)}
              aria-selected={activeId === w.id}
            >
              {w.icon}
              {w.ticker}
            </Tab>
          ))}
        </TabRow>

        <Body>
          <PlanTag>
            <span>◈</span>
            {plan.name} · €{plan.price.toFixed(2)}/mo
          </PlanTag>

          <WalletBox $color={wallet.color} $glow={wallet.glow}>
            <WalletLabel>{wallet.label} ({wallet.ticker}) Address</WalletLabel>
            <AddressRow>
              <Address>{wallet.address}</Address>
              <CopyBtn
                $copied={copied}
                $color={wallet.color}
                onClick={handleCopy}
                aria-label="Copy wallet address"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </CopyBtn>
            </AddressRow>
          </WalletBox>

          <Note $color={wallet.color}>
            ⚠ {wallet.note}
          </Note>

          <Divider />

          <ProofSection>
            {status === 'success' ? (
              <SuccessState>
                ✓ Proof submitted successfully. Access will be granted within 24 hours.
              </SuccessState>
            ) : (
              <>
                <ProofLabel>Submit Proof of Payment</ProofLabel>
                <ProofInputRow onSubmit={handleSubmitProof}>
                  <ProofInput 
                    placeholder="Enter Transaction Hash (TxID)" 
                    value={txHash}
                    onChange={e => setTxHash(e.target.value)}
                    disabled={status === 'loading'}
                    required
                  />
                  <SubmitBtn type="submit" disabled={status === 'loading' || !txHash.trim()}>
                    {status === 'loading' ? 'Sending...' : 'Submit'}
                  </SubmitBtn>
                </ProofInputRow>
                {status === 'error' && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Failed to submit. Please email us at support@euler.life
                  </p>
                )}
              </>
            )}
          </ProofSection>
        </Body>
      </Modal>
    </Backdrop>,
    document.body
  );
};
