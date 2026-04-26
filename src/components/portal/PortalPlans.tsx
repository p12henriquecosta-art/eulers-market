import React from 'react';
import styled from 'styled-components';
import type { Plan } from './portal.types';
import { SectionLabel, PlanGrid, SubCard, SectionTitle } from './portal.styled';
import { track } from '../../lib/analytics';

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

const PLANS: Plan[] = [
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

export const PortalPlans: React.FC = () => (
  <div style={{ marginBottom: '1.5rem' }}>
    <SectionLabel>Available Subscriptions</SectionLabel>
    <PlanGrid>
      {PLANS.map(plan => (
        <SubCard key={plan.name}>
          <PlanBadge $free={plan.free}>{plan.free ? 'Free' : 'Pro'}</PlanBadge>
          <SectionTitle style={{ fontSize: '0.95rem' }}>{plan.name}</SectionTitle>
          <PriceText>
            {plan.free ? 'Free' : <>{`€${plan.price.toFixed(2)}`}<span>/mo</span></>}
          </PriceText>
          <PlanDesc>{plan.desc}</PlanDesc>
          {plan.sumupUrl ? (
            <a
              href={plan.sumupUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              data-track="subscribe_clicked"
              data-plan={plan.name}
              onClick={() => track.subscribeClicked({ plan: plan.name, price: plan.price })}
            >
              <button style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}>
                Subscribe
              </button>
            </a>
          ) : (
            <button
              style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', opacity: 0.5, cursor: 'default' }}
              disabled
            >
              Current Plan
            </button>
          )}
        </SubCard>
      ))}
    </PlanGrid>
  </div>
);
