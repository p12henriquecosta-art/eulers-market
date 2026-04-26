import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { createPortal } from 'react-dom';
import type { Plan } from './portal.types';

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(28px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) }`;

// ─── Styled components ────────────────────────────────────────────────────────
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 8900;
  background: rgba(2, 4, 8, 0.78);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: ${fadeIn} 0.18s ease;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(8, 14, 22, 0.97);
  border: 1px solid rgba(0, 242, 254, 0.12);
  border-radius: 18px;
  box-shadow:
    0 0 0 1px rgba(0,242,254,0.05),
    0 24px 64px rgba(0,0,0,0.65),
    inset 0 1px 0 rgba(255,255,255,0.04);
  animation: ${slideUp} 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  overflow: hidden;
`;

const SheetHeader = styled.div`
  padding: 1.5rem 1.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
`;

const SheetTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.02em;
  margin: 0 0 0.2rem;
`;

const SheetSub = styled.p`
  font-size: 0.78rem;
  color: var(--color-text-muted);
  margin: 0;
`;

const CloseBtn = styled.button`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-dim);
  font-size: 0.9rem;
  padding: 0;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: rgba(255,255,255,0.09);
    color: var(--color-text);
  }
`;

const MethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 1rem 1.25rem;
`;

const MethodBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 1rem;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: background 0.18s ease;
  color: var(--color-text);

  &:hover {
    background: rgba(0, 242, 254, 0.05);
  }

  & + & {
    border-top: 1px solid rgba(255,255,255,0.04);
    border-radius: 0;
  }

  &:first-child { border-radius: 12px 12px 0 0; }
  &:last-child  { border-radius: 0 0 12px 12px; }
  &:only-child  { border-radius: 12px; }
`;

const IconBox = styled.div<{ $bg: string; $border: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $border }) => $border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
`;

const MethodInfo = styled.div`
  flex: 1;
`;

const MethodName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.15rem;
`;

const MethodHint = styled.div`
  font-size: 0.76rem;
  color: var(--color-text-muted);
`;

const Chevron = styled.span`
  font-size: 0.85rem;
  color: var(--color-text-muted);
  flex-shrink: 0;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.05);
  margin: 0 1rem;
`;

const PlanPill = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: rgba(0,242,254,0.04);
  border-bottom: 1px solid rgba(0,242,254,0.08);
  font-size: 0.8rem;
`;

const PlanName = styled.span`
  color: var(--color-text-dim);
`;

const PlanPrice = styled.span`
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
`;

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  plan: Plan;
  onClose: () => void;
  onSelectCard: () => void;
  onSelectBank: () => void;
  onSelectCrypto: () => void;
}

export const PaymentMethodSheet: React.FC<Props> = ({
  plan, onClose, onSelectCard, onSelectBank, onSelectCrypto,
}) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <Backdrop onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <Sheet onClick={e => e.stopPropagation()}>
        <SheetHeader>
          <div>
            <SheetTitle>Choose Payment Method</SheetTitle>
            <SheetSub>Select how you'd like to subscribe</SheetSub>
          </div>
          <CloseBtn onClick={onClose} aria-label="Close">✕</CloseBtn>
        </SheetHeader>

        <PlanPill>
          <PlanName>{plan.name}</PlanName>
          <PlanPrice>€{plan.price.toFixed(2)}/mo</PlanPrice>
        </PlanPill>

        <MethodList>
          {/* Card */}
          <MethodBtn
            id="payment-method-card"
            onClick={onSelectCard}
            aria-label="Pay by card"
          >
            <IconBox $bg="rgba(0,242,254,0.08)" $border="rgba(0,242,254,0.18)">💳</IconBox>
            <MethodInfo>
              <MethodName>Credit / Debit Card</MethodName>
              <MethodHint>Visa, Mastercard · Instant activation</MethodHint>
            </MethodInfo>
            <Chevron>›</Chevron>
          </MethodBtn>

          <Divider />

          {/* Bank Transfer */}
          <MethodBtn
            id="payment-method-bank"
            onClick={onSelectBank}
            aria-label="Request invoice for bank transfer"
          >
            <IconBox $bg="rgba(202,138,4,0.08)" $border="rgba(202,138,4,0.2)">🏦</IconBox>
            <MethodInfo>
              <MethodName>Bank Transfer</MethodName>
              <MethodHint>Receive an invoice by email · 1–3 business days</MethodHint>
            </MethodInfo>
            <Chevron>›</Chevron>
          </MethodBtn>

          <Divider />

          {/* Crypto */}
          <MethodBtn
            id="payment-method-crypto"
            onClick={onSelectCrypto}
            aria-label="Pay with cryptocurrency"
          >
            <IconBox $bg="rgba(247,147,26,0.08)" $border="rgba(247,147,26,0.2)">⬡</IconBox>
            <MethodInfo>
              <MethodName>Cryptocurrency</MethodName>
              <MethodHint>BTC · XRP · USDC via Ethereum · 24 h activation</MethodHint>
            </MethodInfo>
            <Chevron>›</Chevron>
          </MethodBtn>
        </MethodList>
      </Sheet>
    </Backdrop>,
    document.body
  );
};
