import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const HeroWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 2rem 3rem;
  overflow: hidden;
  width: 100%;
`;

const Title = styled(motion.h2)`
  font-size: 3.5rem;
  line-height: 1.1;
  margin: 0;
  max-width: 800px;
  background: linear-gradient(to right, #fff, rgba(255,255,255,0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubTitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #94a3b8;
  margin-top: 1.5rem;
  max-width: 600px;
  line-height: 1.6;
`;

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const TickerContainer = styled(motion.div)`
  margin-top: 3rem;
  width: 100vw;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  opacity: 0.6;
  
  /* Fade edges */
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
`;

const TickerTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 30s linear infinite;
  
  &:hover {
    animation-play-state: paused;
  }
`;

const ModelItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  white-space: nowrap;

  span {
    color: var(--color-primary);
  }
`;

const models = [
  "ChatGPT Plus", "Claude Pro", "Gemini Advanced", 
  "Midjourney", "Perplexity Pro", "GitHub Copilot",
  "Poe Subscription", "RunwayML Gen-2"
];

export const Hero: React.FC = () => (
  <HeroWrapper>
    <Title
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      Exchange your AI subscriptions. Effortlessly.
    </Title>
    <SubTitle
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
    >
      The secondary market for ChatGPT, Claude, and Gemini seats. 
      Save money or recoup your unused subscription value.
    </SubTitle>
    
    <TickerContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay: 0.8 }}
    >
      <TickerTrack>
        {[...models, ...models].map((model, idx) => (
          <ModelItem key={idx}>
            <span>✦</span> {model}
          </ModelItem>
        ))}
      </TickerTrack>
    </TickerContainer>
  </HeroWrapper>
);
