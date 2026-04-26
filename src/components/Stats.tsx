import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// ─── Layout ────────────────────────────────────────────────────────────────────
const StatsWrapper = styled.section`
  padding: 3.5rem 0;
  width: 100%;
  position: relative;
  overflow: hidden;

  /* Top + bottom 1px borders using glass tokens */
  border-top:    1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  /* Subtle glass background — no opaque fill */
  background: rgba(255, 255, 255, 0.01);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  /* Dim radial ambient behind the numbers */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 100% at 50% 50%, rgba(0, 242, 254, 0.03) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

// ─── Stat Item ────────────────────────────────────────────────────────────────
const StatItem = styled(motion.div)`
  text-align: center;
  padding: 1.5rem 1rem;
  position: relative;

  /* Vertical divider on right (not on last) */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0; top: 20%; bottom: 20%;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 50%, transparent);
  }

  @media (max-width: 768px) {
    &:nth-child(2n)::after { display: none; }
  }
`;

// ─── Stat Value ───────────────────────────────────────────────────────────────
const StatValue = styled.div`
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 4vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  margin-bottom: 0.5rem;
  line-height: 1;

  /* Gradient from white to primary cyan */
  background: linear-gradient(135deg, #ffffff 30%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// ─── Stat Label ───────────────────────────────────────────────────────────────
const StatLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: '$14k',  label: 'Volume Traded' },
  { value: '450+',  label: 'Active Nodes' },
  { value: '24ms',  label: 'Avg Latency' },
  { value: '99.9%', label: 'Uptime' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const Stats: React.FC = () => {
  const { t } = useTranslation();
  const labelKeys: Array<keyof typeof import('../locales/en.json')['stats']> = [
    'volumeTraded', 'activeNodes', 'avgLatency', 'uptime',
  ];

  return (
    <StatsWrapper>
      <StatsGrid>
        {stats.map((stat, i) => (
          <StatItem
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
          >
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{t(`stats.${labelKeys[i]}`)}</StatLabel>
          </StatItem>
        ))}
      </StatsGrid>
    </StatsWrapper>
  );
};
