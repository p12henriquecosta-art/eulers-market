import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionLabel = styled.p`
  font-family: var(--font-main);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -0.04em;
  font-weight: 800;
  color: var(--color-text);
  margin-bottom: 1rem;
`;

const SectionSub = styled.p`
  color: var(--color-text-dim);
  font-size: 1.1rem;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.65;
`;

const CyanRule = styled.div`
  width: 48px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary) 50%, transparent);
  box-shadow: 0 0 8px rgba(0, 242, 254, 0.2);
  margin: 1.5rem auto 0;
`;

// ─── Layout ────────────────────────────────────────────────────────────────────
const FeaturesWrapper = styled.section`
  padding: var(--space-4xl, 6rem) 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 3.5rem;
`;

// ─── Card ─────────────────────────────────────────────────────────────────────
const FeatureCard = styled(motion.div)`
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

  /* Subtle inner highlight */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 242, 254, 0.25), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Bottom-right ambient glow on hover */
  &::after {
    content: '';
    position: absolute;
    bottom: -20px; right: -20px;
    width: 80px; height: 80px;
    background: radial-gradient(circle, rgba(0, 242, 254, 0.08), transparent 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(0, 242, 254, 0.2);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 242, 254, 0.08);

    &::before { opacity: 1; }
    &::after  { opacity: 1; }
  }
`;

// ─── Icon ─────────────────────────────────────────────────────────────────────
const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(0, 242, 254, 0.08);
  border: 1px solid rgba(0, 242, 254, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  color: var(--color-primary);
  transition: background 0.3s ease, box-shadow 0.3s ease;

  svg { width: 22px; height: 22px; }

  ${FeatureCard}:hover & {
    background: rgba(0, 242, 254, 0.12);
    box-shadow: 0 0 16px rgba(0, 242, 254, 0.15);
  }
`;

// ─── Text ─────────────────────────────────────────────────────────────────────
const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  color: var(--color-text-dim);
  font-size: 0.95rem;
  line-height: 1.65;
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    title: 'Zero-Knowledge Escrow',
    text: 'Trade compute capacity without ever exposing your private API keys or credentials. Every transaction is cryptographically isolated.',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Instant Liquidity',
    text: 'Convert unused monthly subscription value into spendable credits in milliseconds. The secondary market is always open.',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Global Scale',
    text: 'Access high-performance GPU clusters and frontier AI models from any region with sub-25ms median latency.',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const Features: React.FC = () => (
  <FeaturesWrapper>
    <div style={{ textAlign: 'center' }}>
      <SectionLabel>Infrastructure</SectionLabel>
      <SectionTitle>Engineered for Performance</SectionTitle>
      <SectionSub>
        The infrastructure that makes AI subscription secondary markets possible — secure, fast, global.
      </SectionSub>
      <CyanRule />
    </div>

    <Grid>
      {features.map((feature, idx) => (
        <FeatureCard
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.23, 1, 0.32, 1] }}
        >
          <IconWrapper>{feature.icon}</IconWrapper>
          <CardTitle>{feature.title}</CardTitle>
          <CardText>{feature.text}</CardText>
        </FeatureCard>
      ))}
    </Grid>
  </FeaturesWrapper>
);
