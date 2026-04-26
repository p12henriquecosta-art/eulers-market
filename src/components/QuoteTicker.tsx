import React from 'react';
import styled, { keyframes } from 'styled-components';
import { track } from '../lib/analytics';

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Quote {
  company:  string;
  person:   string;
  role:     string;
  quote:    string;
  source:   string;
  href:     string;
  color:    string; // brand accent
  symbol:   string; // short brand mark / abbreviation
}

const QUOTES: Quote[] = [
  {
    company: 'Accenture',
    person:  'Alex Holt',
    role:    'Vice Chair & Global Strategy Leader',
    quote:   '"2026 will separate enterprises that deployed AI agents from those that transformed around them. The ROI ceiling isn\'t set by the technology — it\'s set by the willingness to trust intelligent systems with consequential decisions."',
    source:  'The 2026 State of AI Agents Report',
    href:    'https://www.accenture.com/us-en/insights/artificial-intelligence/state-of-ai-agents',
    color:   '#A100FF',
    symbol:  'Ac',
  },
  {
    company: 'BCG',
    person:  'Tom Martin',
    role:    'Director of AI Platforms',
    quote:   '"We find clients succeed and realize P&L impact faster when they focus on transforming their systems end-to-end with agents at the center, rather than as a tack-on to legacy processes."',
    source:  'BCG AI Transformation Insights',
    href:    'https://www.bcg.com/capabilities/artificial-intelligence',
    color:   '#00A67E',
    symbol:  'BCG',
  },
  {
    company: 'Vercel',
    person:  'Guillermo Rauch',
    role:    'Founder & CEO',
    quote:   '"The next wave of agent failures won\'t be about what agents can\'t do. It\'ll be about what teams can\'t observe. Agents need the same production feedback loops we\'ve always expected from great software."',
    source:  'Datadog: State of AI Engineering',
    href:    'https://www.datadoghq.com/state-of-ai-engineering/',
    color:   '#FFFFFF',
    symbol:  '▲',
  },
  {
    company: 'Deloitte',
    person:  'Deloitte Insights',
    role:    'Research Team',
    quote:   '"Fluency in token economics will increasingly distinguish organizations that can scale AI confidently and convert consumption into measurable enterprise value."',
    source:  'AI Tokens: Navigate AI\'s New Spend Dynamics',
    href:    'https://www2.deloitte.com/us/en/insights/focus/tech-trends/2025/tokenomics-and-managing-ai-costs.html',
    color:   '#86BC25',
    symbol:  'De',
  },
  {
    company: 'Portal26',
    person:  'Arti Raman',
    role:    'Chief Executive',
    quote:   '"Agentic AI is powerful, but without cost controls, it can quickly become expensive and chaotic. We give teams telemetry to scale agents without waking up to an unplanned invoice."',
    source:  'Portal26: Agentic Token Controls',
    href:    'https://siliconangle.com/2025/02/19/portal26-launches-agentic-token-controls/',
    color:   '#3B82F6',
    symbol:  'P26',
  },
  {
    company: 'Braintrust',
    person:  'Product Engineering Team',
    role:    'Braintrust',
    quote:   '"Deploying a large language model to production is straightforward. Keeping it reliable, cost-effective, and high-quality is not."',
    source:  'Best Tools for Monitoring LLM Apps in 2026',
    href:    'https://www.braintrustdata.com/blog/llm-monitoring',
    color:   '#F97316',
    symbol:  'Bt',
  },
  {
    company: 'Consultancy.uk',
    person:  'Industry Research',
    role:    'Professional Services Study',
    quote:   '"Close to half of professional services staff feel using AI technology has allowed for improvements in their work-life balance — saving between three and six hours weekly."',
    source:  'AI and Work-Life Balance',
    href:    'https://www.consultancy.uk/news/39064/half-of-professional-services-staff-say-ai-improves-work-life-balance',
    color:   '#6366F1',
    symbol:  'Cu',
  },
];

// ─── Keyframes ────────────────────────────────────────────────────────────────
const marquee = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// ─── Styles ───────────────────────────────────────────────────────────────────
const Section = styled.section`
  overflow: hidden;
  padding: 0;
  position: relative;
  border-top: 1px solid rgba(0, 242, 254, 0.08);
  border-bottom: 1px solid rgba(0, 242, 254, 0.08);
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);

  /* Edge fade masks */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 160px;
    z-index: 2;
    pointer-events: none;
  }
  &::before {
    left: 0;
    background: linear-gradient(90deg, #020408 0%, transparent 100%);
  }
  &::after {
    right: 0;
    background: linear-gradient(270deg, #020408 0%, transparent 100%);
  }
`;

const Track = styled.div`
  display: flex;
  width: max-content;
  animation: ${marquee} 72s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const Card = styled.a<{ $color: string }>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem 2rem;
  text-decoration: none;
  flex-shrink: 0;
  max-width: 480px;
  width: 480px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.25s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.025);
  }

  &:hover .badge {
    box-shadow: 0 0 12px -2px ${p => p.$color}88;
  }
`;

const Badge = styled.div<{ $color: string }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid ${p => p.$color}55;
  background: ${p => p.$color}15;
  color: ${p => p.$color};
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.25s ease;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const QuoteText = styled.p`
  font-size: 0.82rem;
  color: rgba(226, 232, 240, 0.85);
  line-height: 1.5;
  margin: 0;
  font-style: italic;

  /* Clamp to two lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Person = styled.span<{ $color: string }>`
  font-size: 0.72rem;
  font-weight: 700;
  color: ${p => p.$color};
  letter-spacing: 0.04em;
`;

const SourceLabel = styled.span`
  font-size: 0.68rem;
  color: rgba(148, 163, 184, 0.6);

  &::before {
    content: '↗';
    margin-right: 2px;
    font-size: 0.6rem;
  }
`;

// ─── CTA Banner ───────────────────────────────────────────────────────────────
const CTABanner = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 100% at 50% 100%, rgba(0,242,254,0.04) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const CTALabel = styled.p`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 1rem;
`;

const CTAHeading = styled.h3`
  font-size: clamp(1.15rem, 2.5vw, 1.6rem);
  font-weight: 600;
  color: #e2e8f0;
  letter-spacing: -0.02em;
  max-width: 680px;
  margin: 0 auto 1.75rem;
  line-height: 1.45;

  em {
    font-style: normal;
    color: var(--color-primary);
  }
`;

const CTARow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

// ─── Component ────────────────────────────────────────────────────────────────
export const QuoteTicker: React.FC = () => {
  // Duplicate the array so the marquee loops seamlessly
  const doubled = [...QUOTES, ...QUOTES];

  const handleClick = (q: Quote) => {
    track.quoteTickerClicked({ company: q.company, href: q.href });
  };

  return (
    <>
      {/* ── Ticker ── */}
      <Section aria-label="Industry perspectives on AI investment">
        <Track>
          {doubled.map((q, i) => (
            <Card
              key={`${q.company}-${i}`}
              href={q.href}
              target="_blank"
              rel="noopener noreferrer"
              $color={q.color}
              title={`${q.person} — ${q.company}`}
              onClick={() => handleClick(q)}
            >
              <Badge $color={q.color} className="badge">{q.symbol}</Badge>
              <Body>
                <QuoteText>{q.quote}</QuoteText>
                <Meta>
                  <Person $color={q.color}>{q.person} · {q.company}</Person>
                  <SourceLabel>{q.source}</SourceLabel>
                </Meta>
              </Body>
            </Card>
          ))}
        </Track>
      </Section>

      {/* ── CTA beneath ticker ── */}
      <CTABanner>
        <CTALabel>Market Intelligence</CTALabel>
        <CTAHeading>
          Don't let your premium compute go to waste.<br />
          <em>Liquidate or access top-tier intelligence</em> on Euler's Market.
        </CTAHeading>
        <CTARow>
          <a
            href="#waitlist"
            onClick={() => track.navCtaClicked({ cta: 'request_access' })}
            style={{ textDecoration: 'none' }}
          >
            <button>Request Early Access</button>
          </a>
          <a
            href="https://euler-life.sumupstore.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button className="btn-secondary">Browse Plans →</button>
          </a>
        </CTARow>
      </CTABanner>
    </>
  );
};
