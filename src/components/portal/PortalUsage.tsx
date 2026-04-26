import React from 'react';
import styled from 'styled-components';
import type { UsageBar } from './portal.types';
import { Card, SectionLabel, SectionTitle, FullRow, cardAnim } from './portal.styled';

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

const USAGE_DATA: UsageBar[] = [
  { label: 'GPT-4o',    pct: 72, color: 'linear-gradient(to top, #00F2FE, #4FACFE)' },
  { label: 'Claude',    pct: 55, color: 'linear-gradient(to top, #A78BFA, #7C3AED)' },
  { label: 'Perplexity',pct: 38, color: 'linear-gradient(to top, #34D399, #059669)' },
  { label: 'Custom',    pct: 20, color: 'linear-gradient(to top, #FCD34D, #CA8A04)' },
  { label: 'Week −4',   pct: 50, color: 'rgba(255,255,255,0.08)' },
  { label: 'Week −3',   pct: 65, color: 'rgba(255,255,255,0.08)' },
  { label: 'Week −2',   pct: 48, color: 'rgba(255,255,255,0.08)' },
  { label: 'Week −1',   pct: 80, color: 'rgba(255,255,255,0.08)' },
];

export const PortalUsage: React.FC = () => (
  <FullRow>
    <Card {...cardAnim} transition={{ duration: 0.4, delay: 0.15 }}>
      <SectionLabel>API Usage · Per Scribe</SectionLabel>
      <SectionTitle>Monthly call distribution by provider</SectionTitle>

      {/* Faded placeholder chart — activates when first scribe is initialised */}
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
);
