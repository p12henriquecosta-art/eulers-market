import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { createPortal } from 'react-dom';
import type { Plan } from './portal.types';
import { useTranslation } from 'react-i18next';

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

const Chevron = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: transform 0.2s var(--ease-out), color 0.2s var(--ease-out);
  
  ${MethodBtn}:hover & {
    color: var(--color-primary);
    transform: translateX(2px);
  }
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
  const { t } = useTranslation();

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
            <SheetTitle>{t('portal.methods.title')}</SheetTitle>
            <SheetSub>{t('portal.methods.subtitle')}</SheetSub>
          </div>
          <CloseBtn onClick={onClose} aria-label={t('common.close') || 'Close'}>✕</CloseBtn>
        </SheetHeader>

        <PlanPill>
          <PlanName>{t(`portal.plans.items.${plan.id}.name`)}</PlanName>
          <PlanPrice>€{plan.price.toFixed(2)}{t('portal.plans.perMonth')}</PlanPrice>
        </PlanPill>

        <MethodList>
          {/* Card */}
          <MethodBtn
            id="payment-method-card"
            onClick={onSelectCard}
            aria-label={t('portal.methods.card')}
          >
            <IconBox $bg="rgba(0,242,254,0.06)" $border="rgba(0,242,254,0.15)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </IconBox>
            <MethodInfo>
              <MethodName>{t('portal.methods.card')}</MethodName>
              <MethodHint>{t('portal.plans.secureLinkHint')}</MethodHint>
            </MethodInfo>
            <Chevron>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Chevron>
          </MethodBtn>

          <Divider />

          {/* Bank Transfer */}
          <MethodBtn
            id="payment-method-bank"
            onClick={onSelectBank}
            aria-label={t('portal.methods.bank')}
          >
            <IconBox $bg="rgba(255,255,255,0.04)" $border="rgba(255,255,255,0.08)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M3 10h18" />
                <path d="M5 6l7-3 7 3" />
                <path d="M4 10v11" />
                <path d="M20 10v11" />
                <path d="M8 14v3" />
                <path d="M12 14v3" />
                <path d="M16 14v3" />
              </svg>
            </IconBox>
            <MethodInfo>
              <MethodName>{t('portal.methods.bank')}</MethodName>
              <MethodHint>{t('portal.plans.bankTransferHint')}</MethodHint>
            </MethodInfo>
            <Chevron>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Chevron>
          </MethodBtn>

          <Divider />

          {/* Crypto */}
          <MethodBtn
            id="payment-method-crypto"
            onClick={onSelectCrypto}
            aria-label={t('portal.methods.crypto')}
          >
            <IconBox $bg="rgba(255,255,255,0.04)" $border="rgba(255,255,255,0.08)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l4.5 2.5v11L12 18l-4.5-2.5v-11z" />
                <path d="M12 18v4" />
                <path d="M4.5 4.5l3 1.5" />
                <path d="M19.5 4.5l-3 1.5" />
                <path d="M12 7l3 1.5v3.5L12 13.5 9 12V8.5z" />
              </svg>
            </IconBox>
            <MethodInfo>
              <MethodName>{t('portal.methods.crypto')}</MethodName>
              <MethodHint>{t('portal.plans.cryptoHint')}</MethodHint>
            </MethodInfo>
            <Chevron>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Chevron>
          </MethodBtn>
        </MethodList>
      </Sheet>
    </Backdrop>,
    document.body
  );
};
