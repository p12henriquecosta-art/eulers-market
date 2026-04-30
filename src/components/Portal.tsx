import React, { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useToast } from './ui/Toast';
import { PaymentMethodSheet } from './portal/PaymentMethodSheet';
import { CryptoPaymentModal } from './portal/CryptoPaymentModal';
import { PLANS } from './portal/portal.data';
import type { Plan } from './portal/portal.types';
import { useTranslation } from 'react-i18next';
import { track } from '../lib/analytics';
import {
  PortalWrapper,
  PortalHeader,
  SectionLabel,
  SectionTitle,
  TwoCol,
  PlanGrid,
  FullRow,
  Card,
  SubCard,
  InlineRow,
  SmBtn,
  DestructiveBtn,
  Table,
  Th,
  Td,
  StatusPill,
  InvoiceRow,
  TableWrapper,
  cardAnim
} from './portal/portal.styled';
import styled from 'styled-components';

// ─── Local Styled Components (Specific to Portal Dashboard) ───────────────────
const KeyInput = styled.input`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  background: rgba(0, 0, 0, 0.45);
  color: var(--color-primary);
`;

const CustomKeyInput = styled.input`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.45);
`;

const PlanBadge = styled.span<{ $free?: boolean }>`
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: ${p => p.$free ? 'rgba(34,197,94,0.12)' : 'rgba(0,242,254,0.1)'};
  color: ${p => p.$free ? '#22C55E' : 'var(--color-primary)'};
  border: 1px solid ${p => p.$free ? 'rgba(34,197,94,0.25)' : 'rgba(0,242,254,0.2)'};
  align-self: flex-start;
`;

const PriceText = styled.div`
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.03em;

  span {
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--color-text-dim);
    margin-left: 2px;
  }
`;

const PlanDesc = styled.p`
  font-size: 0.83rem;
  color: var(--color-text-dim);
  line-height: 1.5;
  flex: 1;
`;

// ─── Usage chart ─────────────────────────────────────────────────────────────────
const ChartBar = styled.div<{ $h: number }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const BarFill = styled.div<{ $pct: number; $color: string }>`
  width: 100%;
  max-width: 36px;
  height: 120px;
  background: rgba(255,255,255,0.05);
  border-radius: 6px 6px 2px 2px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${p => p.$pct}%;
    background: ${p => p.$color};
    border-radius: 6px 6px 2px 2px;
    transition: height 1s var(--ease-out);
  }
`;

const BarLabel = styled.span`
  font-size: 0.7rem;
  color: var(--color-text-muted);
  text-align: center;
`;

// ─── Mock data ────────────────────────────────────────────────────────────────────
const PURCHASE_HISTORY = [
  { date: '2026-04-15', product: 'Early Access · Claude AI', amount: '€9.99', status: 'Completed' },
  { date: '2026-03-15', product: 'Early Access · Claude AI', amount: '€9.99', status: 'Completed' },
  { date: '2026-02-15', product: 'Early Access · Claude AI', amount: '€9.99', status: 'Completed' },
];

const USAGE_DATA = [
  { label: 'GPT-4o', pct: 72, color: 'linear-gradient(to top, #00F2FE, #4FACFE)' },
  { label: 'Claude', pct: 55, color: 'linear-gradient(to top, #A78BFA, #7C3AED)' },
  { label: 'Perplexity', pct: 38, color: 'linear-gradient(to top, #34D399, #059669)' },
  { label: 'Custom', pct: 20, color: 'linear-gradient(to top, #FCD34D, #CA8A04)' },
  { label: 'Week −4', pct: 50, color: 'rgba(255,255,255,0.08)' },
  { label: 'Week −3', pct: 65, color: 'rgba(255,255,255,0.08)' },
  { label: 'Week −2', pct: 48, color: 'rgba(255,255,255,0.08)' },
  { label: 'Week −1', pct: 80, color: 'rgba(255,255,255,0.08)' },
];

const INVOICES = [
  { date: '2026-04-16', label: 'Invoice #EULR-2026-004' },
  { date: '2026-03-16', label: 'Invoice #EULR-2026-003' },
  { date: '2026-02-16', label: 'Invoice #EULR-2026-002' },
];

// ─── Component ────────────────────────────────────────────────────────────────────
export const Portal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [accessKey] = useState('EULR-XXXXXXXX-XXXX');
  const [customKey, setCustomKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showMethodSheet, setShowMethodSheet] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);

  const handleLogout = async () => { await signOut(auth); };

  const handleSaveKey = () => {
    if (!customKey.trim()) return;
    setKeySaved(true);
    toast(t('portal.keys.saveSuccess') || 'Custom integration key updated successfully.', 'success');
    track.event('key_update', { type: 'custom' });
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleRotateKey = () => {
    toast(t('portal.keys.rotateInitiated') || 'Platform key rotation initiated. New key will be generated shortly.', 'info');
    track.event('key_rotate', { type: 'platform' });
  };

  const handleRevokeKey = () => {
    if (confirm(t('portal.keys.revokeConfirm') || 'Are you sure you want to revoke this platform key? All active scribes using this key will be disconnected.')) {
      toast(t('portal.keys.revokeInitiated') || 'Platform key revocation initiated.', 'error');
      track.event('key_revoke', { type: 'platform' });
    }
  };

  const handleSubscribeClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowMethodSheet(true);
  };

  const handleSelectCard = async () => {
    if (!selectedPlan || selectedPlan.free) return;
    
    setShowMethodSheet(false);
    
    const email = auth.currentUser?.email;
    const name = auth.currentUser?.displayName || 'Visionary Customer';
    
    try {
      toast(t('portal.billing.initiating') || `Initiating secure payment link for ${selectedPlan.name}...`, 'info');
      
      const response = await fetch('/api/viva/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(selectedPlan.price * 100),
          customerEmail: email,
          customerName: name,
          planName: t(`portal.plans.items.${selectedPlan.id}.name`) || selectedPlan.name,
          language: i18n.language // Pass current language for the email notification
        })
      });

      if (response.ok) {
        toast(t('portal.billing.linkSent', { email }) || `Payment link sent! Check your inbox: ${email}`, 'success');
      } else {
        throw new Error('Failed to create payment order');
      }
    } catch (error) {
      console.error('[Viva] Error:', error);
      toast(t('portal.billing.error') || 'Could not initiate payment. Please try again or contact support.', 'error');
    }
  };

  const handleSelectBank = () => {
    window.location.href = `mailto:support@euler.life?subject=Invoice Request: ${selectedPlan?.name}&body=Please generate an invoice for the ${selectedPlan?.name} plan. My account email is ${auth.currentUser?.email || ''}`;
    setShowMethodSheet(false);
    toast(t('portal.billing.redirecting') || 'Redirecting to your email client for invoice request.', 'info');
  };

  const handleSelectCrypto = () => {
    setShowMethodSheet(false);
    setShowCryptoModal(true);
  };

  return (
    <main>
      <PortalWrapper>
        {/* ── Header ── */}
        <PortalHeader>
          <div>
            <SectionLabel style={{ marginBottom: '0.5rem' }}>
              {t('portal.label')}
            </SectionLabel>
            <h2 style={{ marginBottom: '0.35rem' }}>{t('portal.title')}</h2>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
              {auth.currentUser?.email}
            </p>
          </div>
          <button className="btn-secondary" onClick={handleLogout}>{t('portal.logout')}</button>
        </PortalHeader>

        {/* ── Row 1: Access Keys ── */}
        <FullRow>
          <SectionLabel>{t('portal.keys.label')}</SectionLabel>
          <Card {...cardAnim} transition={{ duration: 0.4 }}>
            <SectionTitle>{t('portal.keys.title')}</SectionTitle>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              {t('portal.keys.description')}
            </p>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
              {t('portal.keys.platformKey')}
            </label>
            <InlineRow style={{ marginBottom: '1.25rem' }}>
              <KeyInput type="text" value={accessKey} readOnly />
              <SmBtn onClick={handleRotateKey}>{t('portal.keys.rotate')}</SmBtn>
              <DestructiveBtn onClick={handleRevokeKey}>{t('portal.keys.revoke')}</DestructiveBtn>
            </InlineRow>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
              {t('portal.keys.customKey')}
            </label>
            <InlineRow>
              <CustomKeyInput
                type="text"
                placeholder={t('portal.keys.customKeyPlaceholder')}
                value={customKey}
                onChange={e => setCustomKey(e.target.value)}
              />
              <SmBtn onClick={handleSaveKey} disabled={!customKey.trim()}>
                {keySaved ? t('portal.keys.saved') : t('portal.keys.save')}
              </SmBtn>
            </InlineRow>
          </Card>
        </FullRow>

        {/* ── Row 2: Subscriptions ── */}
        <FullRow>
          <SectionLabel>{t('portal.plans.label')}</SectionLabel>
          <PlanGrid>
            {PLANS.map(plan => (
              <SubCard key={plan.id}>
                <PlanBadge $free={plan.free}>{plan.free ? t('portal.plans.free') : t('portal.plans.pro')}</PlanBadge>
                <SectionTitle style={{ fontSize: '0.95rem' }}>
                  {t(`portal.plans.items.${plan.id}.name`)}
                </SectionTitle>
                <PriceText>
                  {plan.free ? t('portal.plans.free') : <>€{plan.price.toFixed(2)}<span>{t('portal.plans.perMonth')}</span></>}
                </PriceText>
                <PlanDesc>
                  {t(`portal.plans.items.${plan.id}.desc`)}
                </PlanDesc>
                {!plan.free ? (
                  <button 
                    onClick={() => handleSubscribeClick(plan)}
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}
                  >
                    {t('portal.plans.subscribe')}
                  </button>
                ) : (
                  <button style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', opacity: 0.5, cursor: 'default' }} disabled>
                    {t('portal.plans.currentPlan')}
                  </button>
                )}
              </SubCard>
            ))}
          </PlanGrid>
        </FullRow>

        {/* ── Row 3: Purchase History + Billing ── */}
        <TwoCol>
          <Card {...cardAnim} transition={{ duration: 0.4, delay: 0.05 }}>
            <SectionLabel>{t('portal.history.label')}</SectionLabel>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>{t('portal.history.date')}</Th>
                    <Th>{t('portal.history.product')}</Th>
                    <Th>{t('portal.history.amount')}</Th>
                    <Th>{t('portal.history.status')}</Th>
                  </tr>
                </thead>
                <tbody>
                  {PURCHASE_HISTORY.length === 0 ? (
                    <tr>
                      <Td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        {t('portal.history.empty')}
                      </Td>
                    </tr>
                  ) : (
                    PURCHASE_HISTORY.map((row, i) => (
                      <tr key={i}>
                        <Td>{row.date}</Td>
                        <Td style={{ color: 'var(--color-text)' }}>{row.product}</Td>
                        <Td>{row.amount}</Td>
                        <Td>
                          <StatusPill $status={row.status}>{row.status}</StatusPill>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          </Card>

          <Card {...cardAnim} transition={{ duration: 0.4, delay: 0.1 }}>
            <SectionLabel>{t('portal.billing.label')}</SectionLabel>
            {INVOICES.length === 0 ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', padding: '1.5rem 0', textAlign: 'center' }}>
                {t('portal.billing.empty')}
              </p>
            ) : (
              INVOICES.map((inv, i) => (
                <InvoiceRow key={i}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{inv.date}</span>
                  <span style={{ color: 'var(--color-text-dim)' }}>{inv.label}</span>
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    style={{ color: 'var(--color-primary)', fontSize: '0.82rem', textDecoration: 'none', flexShrink: 0 }}
                  >
                    {t('portal.billing.download')}
                  </a>
                </InvoiceRow>
              ))
            )}
          </Card>
        </TwoCol>

        {/* ── Row 4: Usage Chart ── */}
        <FullRow>
          <Card {...cardAnim} transition={{ duration: 0.4, delay: 0.15 }}>
            <SectionLabel>{t('portal.usage.label')}</SectionLabel>
            <SectionTitle>{t('portal.usage.title')}</SectionTitle>
            <div style={{ opacity: 0.25, pointerEvents: 'none', userSelect: 'none' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {USAGE_DATA.map((bar, i) => (
                  <ChartBar key={i} $h={bar.pct}>
                    <BarFill $pct={bar.pct} $color={bar.color} />
                    <BarLabel>{bar.label}</BarLabel>
                  </ChartBar>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {USAGE_DATA.slice(0, 4).map((bar, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: bar.color, display: 'inline-block', flexShrink: 0 }} />
                    {bar.label} · {bar.pct}%
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
              {t('portal.usage.inactive')}
            </p>
          </Card>
        </FullRow>

        {showMethodSheet && selectedPlan && (
          <PaymentMethodSheet
            plan={selectedPlan}
            onClose={() => setShowMethodSheet(false)}
            onSelectCard={handleSelectCard}
            onSelectBank={handleSelectBank}
            onSelectCrypto={handleSelectCrypto}
          />
        )}

        {showCryptoModal && selectedPlan && (
          <CryptoPaymentModal
            plan={selectedPlan}
            onClose={() => setShowCryptoModal(false)}
          />
        )}
      </PortalWrapper>
    </main>
  );
};
