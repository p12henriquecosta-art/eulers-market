import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

// ─── Hero Concepts ────────────────────────────────────────────────────────────
const HERO_CONCEPTS = [
  {
    id: 'bridges',
    src: '/hero-seven-bridges.png',
    label: 'Seven Bridges of Liquidity',
  },
  {
    id: 'formula',
    src: '/hero-complex-analysis.png',
    label: 'Complex Analysis of the Infinite Seat',
  },
  {
    id: 'polymath',
    src: '/hero-swiss-polymath.png',
    label: 'The Swiss Polymath in Neo-Basel',
  },
];

const CYCLE_INTERVAL_MS = 6000;

// ─── Keyframes ────────────────────────────────────────────────────────────────
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

const scroll = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

// Obsidian scan-line — a single razor-thin horizontal sweep
const scanLine = keyframes`
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 0.06; }
  90%  { opacity: 0.06; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

// Vector grid pulse (for the obsidian grid overlay)
const gridPulse = keyframes`
  0%, 100% { opacity: 0.04; }
  50%       { opacity: 0.09; }
`;

// ─── Obsidian Minimalism Background System ────────────────────────────────────
// 1. SVG vector grid: razor-thin lines receding to infinity
// 2. Radial void: deep obsidian center deepening outward
// 3. Chromatic edge: 1px cyan bleed on key grid intersections
// 4. Scan-line sweep: slow surveillance aesthetic
const ObsidianVoidBase = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
  background: #020408;
  /* Perspective grid receding to horizon */
  background-image:
    /* Horizontal lines */
    linear-gradient(0deg,   transparent calc(100% - 1px), rgba(0, 242, 254, 0.07) 100%),
    /* Vertical lines */
    linear-gradient(90deg,  transparent calc(100% - 1px), rgba(0, 242, 254, 0.07) 100%),
    /* Deep radial void — absolute darkness in center */
    radial-gradient(ellipse 70% 60% at 50% 45%, rgba(2, 4, 8, 0) 0%, rgba(2, 4, 8, 0.92) 100%);
  background-size: 80px 80px, 80px 80px, 100% 100%;
  animation: ${gridPulse} 8s ease-in-out infinite;
`;

// 2. Laser-edge accent: diagonal glowing line (top-left to bottom-right)
const ObsidianAccentLine = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -5%;
    width: 130%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 242, 254, 0.0) 20%,
      rgba(0, 242, 254, 0.25) 50%,
      rgba(79, 172, 254, 0.15) 70%,
      transparent 100%
    );
    transform: rotate(18deg) translateY(35vh);
    filter: blur(0.5px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(0, 242, 254, 0.12) 35%, transparent 100%);
    animation: ${scanLine} 12s linear infinite;
  }
`;

// 3. Hero image blended on top of the void
const HeroBgLayer = styled(motion.div)<{ $src: string }>`
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: url(${(p) => p.$src});
  background-size: cover;
  background-position: center;

  /* Two-stage blend: darken image then fade into obsidian at top and bottom */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom,
        rgba(2, 4, 8, 0.75) 0%,
        rgba(2, 4, 8, 0.38) 40%,
        rgba(2, 4, 8, 0.38) 60%,
        rgba(2, 4, 8, 0.92) 100%
      );
  }
`;

// ─── UI Components ────────────────────────────────────────────────────────────
const HeroWrapper = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8rem 1rem 4rem;
  width: 100%;
  overflow: hidden;
  isolation: isolate;
`;

const ConceptNav = styled(motion.div)`
  display: flex;
  gap: 0.75rem;
  margin-top: 3rem;
  align-items: center;
`;

const ConceptDot = styled.button<{ $active: boolean }>`
  width: ${(p) => (p.$active ? '2rem' : '0.5rem')};
  height: 0.5rem;
  border-radius: 100px;
  border: none;
  cursor: pointer;
  padding: 0;
  background: ${(p) => (p.$active ? 'var(--color-primary)' : 'rgba(255,255,255,0.25)')};
  box-shadow: ${(p) => (p.$active ? '0 0 10px var(--color-primary)' : 'none')};
  transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1), background 0.3s ease, box-shadow 0.3s ease;
`;

const Badge = styled(motion.div)`
  padding: 0.5rem 1.25rem;
  border-radius: 100px;
  background: rgba(0, 242, 254, 0.06);
  border: 1px solid rgba(0, 242, 254, 0.2);
  color: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 2.5rem;
  backdrop-filter: blur(8px);
`;

// Obsidian split-title: main line in pure white, accented line in #00F2FE
const Title = styled(motion.h2)`
  font-size: clamp(4rem, 8.5vw, 7.5rem);
  line-height: 0.93;
  margin: 0;
  max-width: 1200px;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    rgba(255, 255, 255, 0.92) 55%,
    rgba(255, 255, 255, 0.4) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.055em;
  animation: ${float} 6s ease-in-out infinite;
`;

// Sentence break: the accented second half
const TitleAccent = styled.span`
  display: block;
  margin-top: 0.15em;
  background: linear-gradient(90deg, var(--color-primary) 0%, #4FACFE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 40px rgba(0, 242, 254, 0.25));
`;

const SubTitle = styled(motion.p)`
  font-size: clamp(1.05rem, 2vw, 1.45rem);
  color: var(--color-text-dim);
  margin-top: 2.5rem;
  max-width: 720px;
  line-height: 1.55;
  font-weight: 400;
  letter-spacing: -0.01em;

  /* Highlight the key phrase in white */
  strong {
    color: rgba(255, 255, 255, 0.88);
    font-weight: 500;
  }
`;

// Obsidian separator — a razor divider with a glow center
const ObsidianRule = styled(motion.div)`
  width: 120px;
  height: 1px;
  margin: 2.5rem auto 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 242, 254, 0.5) 50%,
    transparent 100%
  );
  box-shadow: 0 0 12px rgba(0, 242, 254, 0.2);
`;

const TickerContainer = styled(motion.div)`
  margin-top: 5rem;
  width: 100vw;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
`;

const TickerTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 60s linear infinite;
  &:hover { animation-play-state: paused; }
`;

const ModelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 2.5rem;
  border-right: 1px solid var(--glass-border);
  color: var(--color-text-dim);
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.04);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-primary);
    filter: drop-shadow(0 0 5px var(--color-primary));
  }
`;

const models = [
  'ChatGPT Plus', 'Claude Pro', 'Gemini Advanced',
  'Midjourney', 'Perplexity Pro', 'GitHub Copilot',
  'Poe Premium', 'RunwayML Gen-3', 'Luma Dream Machine',
  'ElevenLabs', 'Mistral Large', 'Groq',
];

// ─── Component ────────────────────────────────────────────────────────────────
export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);

  // Non-blocking prefetch of subsequent hero images
  useEffect(() => {
    HERO_CONCEPTS.forEach(({ src }, i) => {
      if (i === 0) return;
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-cycle
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_CONCEPTS.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const handleDotClick = useCallback((idx: number) => setActiveIdx(idx), []);

  return (
    <HeroWrapper>
      {/* ── Obsidian Void Base (always present, grid + radial void) ── */}
      <ObsidianVoidBase />
      <ObsidianAccentLine />

      {/* ── Dynamic Hero Image (crossfades above void) ── */}
      <AnimatePresence mode="wait">
        <HeroBgLayer
          key={HERO_CONCEPTS[activeIdx].id}
          $src={HERO_CONCEPTS[activeIdx].src}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
        />
      </AnimatePresence>

      {/* ── Content ── */}
      <Badge
        initial={{ opacity: 0, scale: 0.88, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      >
        {t('hero.badge')}
      </Badge>

      <Title
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      >
        {t('hero.titleLine1')}
        <TitleAccent>{t('hero.titleLine2')}</TitleAccent>
      </Title>

      <SubTitle
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <Trans i18nKey="hero.subtitle" components={{ strong: <strong /> }} />
      </SubTitle>

      <ObsidianRule
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
      />

      {/* ── Concept selector dots ── */}
      <ConceptNav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        aria-label="Hero concept selector"
      >
        {HERO_CONCEPTS.map((concept, i) => (
          <ConceptDot
            key={concept.id}
            $active={i === activeIdx}
            onClick={() => handleDotClick(i)}
            aria-label={`View concept: ${concept.label}`}
            title={concept.label}
          />
        ))}
      </ConceptNav>

      {/* ── Model Ticker ── */}
      <TickerContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <TickerTrack>
          {[...models, ...models].map((model, i) => (
            <ModelItem key={i}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              {model}
            </ModelItem>
          ))}
        </TickerTrack>
      </TickerContainer>
    </HeroWrapper>
  );
};
