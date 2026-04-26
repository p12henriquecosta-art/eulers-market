import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { PaymentMethodSheet } from './portal/PaymentMethodSheet';
import { CryptoPaymentModal } from './portal/CryptoPaymentModal';
import type { Plan } from './portal/portal.types';

// ─── Layout ────────────────────────────────────────────────────────────────────
const PortalWrapper = styled.div`
  padding: 7rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 640px) {
    padding: 5.5rem 1rem 3rem;
  }
`;

const PortalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 3rem;

  @media (max-width: 640px) {
    align-items: flex-start;
    margin-bottom: 2rem;

    /* Button sits below the title block */
    button {
      width: 100%;
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
`;

const SectionLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ThreeCol = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FullRow = styled.div`
  margin-bottom: 1.5rem;
`;

// ─── Card ───────────────────────────────────────────────────────────────────────
const Card = styled(motion.div)`
  padding: 1.75rem;
  border: 1px solid var(--glass-border);
  background: var(--glass-2-bg);
  backdrop-filter: blur(var(--glass-2-blur));
  -webkit-backdrop-filter: blur(var(--glass-2-blur));
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.04);
  transition: border-color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);

  &:hover {
    border-color: rgba(202, 138, 4, 0.35);
    box-shadow: 0 8px 32px rgba(202, 138, 4, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.04);
  }
`;

const SubCard = styled.div`
  padding: 1.75rem;
  border: 1px solid var(--glass-border);
  background: var(--glass-1-bg);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    border-color: rgba(0, 242, 254, 0.2);
    box-shadow: 0 4px 24px rgba(0, 242, 254, 0.06);
  }
`;

// ─── Form elements ──────────────────────────────────────────────────────────────
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

const InlineRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  input {
    flex: 1;
  }
`;

const SmBtn = styled.button`
  padding: 0.55rem 1.1rem;
  font-size: 0.85rem;
  white-space: nowrap;
`;

const DestructiveBtn = styled.button`
  background: transparent;
  color: #991B1B;
  border: 1px solid #991B1B;
  box-shadow: none;
  padding: 0.55rem 1.1rem;
  font-size: 0.85rem;

  &:hover:not(:disabled) {
    background: rgba(153, 27, 27, 0.1);
    box-shadow: 0 4px 20px -4px rgba(153, 27, 27, 0.4);
    border-color: #EF4444;
    color: #EF4444;
  }
`;

// ─── Subscription plan card ─────────────────────────────────────────────────────
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

// ─── Table ───────────────────────────────────────────────────────────────────────
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.6rem 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--glass-border);
`;

const Td = styled.td`
  padding: 0.85rem 1rem;
  color: var(--color-text-dim);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: middle;

  &:first-child {
    color: var(--color-text-muted);
    font-size: 0.82rem;
  }
`;

const StatusPill = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  background: ${p =>
    p.$status === 'Completed' ? 'rgba(34,197,94,0.1)' :
      p.$status === 'Pending' ? 'rgba(202,138,4,0.1)' :
        'rgba(239,68,68,0.1)'
  };
  color: ${p =>
    p.$status === 'Completed' ? '#22C55E' :
      p.$status === 'Pending' ? '#CA8A04' :
        '#EF4444'
  };

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
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

// ─── Billing row ─────────────────────────────────────────────────────────────────
const InvoiceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  font-size: 0.88rem;
  color: var(--color-text-dim);

  &:last-child { border-bottom: none; }
`;

// ─── Mock data ────────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Early Access',
    price: 0,
    desc: 'Community tier. Access the marketplace with limited scribe concurrency and public listings.',
    sumupUrl: null,
    free: true,
  },
  {
    name: 'Early Access · ChatGPT',
    price: 9.99,
    desc: 'Unlock GPT-4o scribes. Priority queue, extended context window, and commercial usage rights.',
    sumupUrl: 'https://euler-life.sumupstore.com/product/early-access-to-chatgpt',
    free: false,
  },
  {
    name: 'Early Access · Claude AI',
    price: 9.99,
    desc: 'Unlock Claude Sonnet scribes. Superior reasoning and 200K token documents, fully managed.',
    sumupUrl: 'https://euler-life.sumupstore.com/product/early-access-to-claude-ai',
    free: false,
  },
  {
    name: 'Early Access · Perplexity',
    price: 9.99,
    desc: 'Real-time web intelligence. Perplexity-powered scribes with live search augmentation.',
    sumupUrl: 'https://euler-life.sumupstore.com/product/early-access-to-perplexity',
    free: false,
  },
];

const PURCHASE_HISTORY: { date: string; product: string; amount: string; status: string }[] = [];

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

const INVOICES: { date: string; label: string }[] = [];

// ─── Component ────────────────────────────────────────────────────────────────────
const cardAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const Portal: React.FC = () => {
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
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleSubscribeClick = (plan: any) => {
    setSelectedPlan(plan as Plan);
    setShowMethodSheet(true);
  };

  const handleSelectCard = () => {
    if (selectedPlan?.sumupUrl) {
      window.open(selectedPlan.sumupUrl, '_blank', 'noopener,noreferrer');
    }
    setShowMethodSheet(false);
  };

  const handleSelectBank = () => {
    window.location.href = `mailto:support@euler.life?subject=Invoice Request: ${selectedPlan?.name}&body=Please generate an invoice for the ${selectedPlan?.name} plan. My account email is ${auth.currentUser?.email || ''}`;
    setShowMethodSheet(false);
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
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>Customer Sanctuary</div>
            <h2 style={{ marginBottom: '0.35rem' }}>Command Center</h2>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
              {auth.currentUser?.email}
            </p>
          </div>
          <button className="btn-secondary" onClick={handleLogout}>Terminate Session</button>
        </PortalHeader>

        {/* ── Row 1: Access Keys ── */}
        <FullRow>
          <SectionLabel>Access Keys</SectionLabel>
          <Card {...cardAnim} transition={{ duration: 0.4 }}>
            <SectionTitle>API Integration</SectionTitle>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Your read-only market key. Paste a custom integration key from your AI provider below to link scribes directly to your account.
            </p>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
              Platform Key
            </label>
            <InlineRow style={{ marginBottom: '1.25rem' }}>
              <KeyInput type="text" value={accessKey} readOnly />
              <SmBtn>Rotate</SmBtn>
              <DestructiveBtn>Revoke</DestructiveBtn>
            </InlineRow>
            <label style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
              Custom Integration Key
            </label>
            <InlineRow>
              <CustomKeyInput
                type="text"
                placeholder="Paste your provider API key here (e.g. sk-...)"
                value={customKey}
                onChange={e => setCustomKey(e.target.value)}
              />
              <SmBtn onClick={handleSaveKey} disabled={!customKey.trim()}>
                {keySaved ? '✓ Saved' : 'Save'}
              </SmBtn>
            </InlineRow>
          </Card>
        </FullRow>

        {/* ── Row 2: Subscriptions ── */}
        <FullRow>
          <SectionLabel>Available Subscriptions</SectionLabel>
          <ThreeCol>
            {PLANS.map(plan => (
              <SubCard key={plan.name}>
                <PlanBadge $free={plan.free}>{plan.free ? 'Free' : 'Pro'}</PlanBadge>
                <SectionTitle style={{ fontSize: '0.95rem' }}>{plan.name}</SectionTitle>
                <PriceText>
                  {plan.free ? 'Free' : <>€{plan.price.toFixed(2)}<span>/mo</span></>}
                </PriceText>
                <PlanDesc>{plan.desc}</PlanDesc>
                {plan.sumupUrl ? (
                  <button 
                    onClick={() => handleSubscribeClick(plan)}
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}
                  >
                    Subscribe
                  </button>
                ) : (
                  <button style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', opacity: 0.5, cursor: 'default' }} disabled>
                    Current Plan
                  </button>
                )}
              </SubCard>
            ))}
          </ThreeCol>
        </FullRow>

        {/* ── Row 3: Purchase History + Billing ── */}
        <TwoCol>
          <Card {...cardAnim} transition={{ duration: 0.4, delay: 0.05 }}>
            <SectionLabel>Purchase History</SectionLabel>
            <Table>
              <thead>
                <tr>
                  <Th>Date</Th>
                  <Th>Product</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {PURCHASE_HISTORY.length === 0 ? (
                  <tr>
                    <Td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      No purchases yet. Subscribe to a plan above to get started.
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
          </Card>

          <Card {...cardAnim} transition={{ duration: 0.4, delay: 0.1 }}>
            <SectionLabel>Billing &amp; Invoices</SectionLabel>
            {INVOICES.length === 0 ? (
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', padding: '1.5rem 0', textAlign: 'center' }}>
                No invoices yet. Invoices are generated automatically 24h after each successful payment.
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
                    ↓ PDF
                  </a>
                </InvoiceRow>
              ))
            )}
          </Card>
        </TwoCol>

        {/* ── Row 4: Usage Chart ── */}
        <FullRow>
          <Card {...cardAnim} transition={{ duration: 0.4, delay: 0.15 }}>
            <SectionLabel>API Usage · Per Scribe</SectionLabel>
            <SectionTitle>Monthly call distribution by provider</SectionTitle>
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
              Telemetry activates once your first scribe is initialised.
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
