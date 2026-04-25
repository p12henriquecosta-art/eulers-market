import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// ─── Layout ────────────────────────────────────────────────────────────────────
const ProcessWrapper = styled.section`
  padding: var(--space-4xl, 6rem) 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--color-text);
  margin-bottom: 1rem;
`;

const CyanRule = styled.div`
  width: 48px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary) 50%, transparent);
  box-shadow: 0 0 8px rgba(0, 242, 254, 0.2);
  margin: 1.5rem auto 0;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

// ─── Step Card ────────────────────────────────────────────────────────────────
const StepCard = styled(motion.div)`
  padding: 2.5rem;
  background: var(--glass-1-bg, rgba(255,255,255,0.03));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border, rgba(255,255,255,0.08));
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transition:
    border-color 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    background 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);

  /* Top-edge cyan line */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 242, 254, 0.3), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Corner radial glow */
  &::after {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 100px; height: 100px;
    background: radial-gradient(circle, rgba(0, 242, 254, 0.06), transparent 65%);
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(0, 242, 254, 0.18);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);

    &::before { opacity: 1; }
  }
`;

// ─── Step Number ──────────────────────────────────────────────────────────────
const StepNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(0, 242, 254, 0.2);
  background: rgba(0, 242, 254, 0.06);
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 1.75rem;
  font-family: var(--font-mono, monospace);
`;

const StepTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin-bottom: 0.875rem;
`;

const StepDescription = styled.p`
  color: var(--color-text-dim);
  font-size: 0.95rem;
  line-height: 1.65;
`;


// ─── Data ─────────────────────────────────────────────────────────────────────
const steps = [
  {
    title: 'Connect',
    description: 'Link your AI provider accounts via secure OAuth or credit bridge. No credentials are stored in plaintext — ever.',
  },
  {
    title: 'List',
    description: 'Set your price and availability. Our zero-trust smart contract handles the escrow and settlement atomically.',
  },
  {
    title: 'Earn',
    description: 'Receive instant payouts in USDC or platform credits as your compute capacity is utilized across the network.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const Process: React.FC = () => (
  <ProcessWrapper>
    <Header>
      <SectionLabel>Protocol</SectionLabel>
      <Title>How it Works</Title>
      <CyanRule />
    </Header>

    <StepsGrid>
      {steps.map((step, i) => (
        <StepCard
          key={i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
        >
          <StepNumber>0{i + 1}</StepNumber>
          <StepTitle>{step.title}</StepTitle>
          <StepDescription>{step.description}</StepDescription>
        </StepCard>
      ))}
    </StepsGrid>
  </ProcessWrapper>
);
