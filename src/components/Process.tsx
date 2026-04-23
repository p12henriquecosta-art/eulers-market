import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProcessWrapper = styled.section`
  padding: 8rem 0;
  width: 100%;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 6rem;
`;

const Label = styled.span`
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.8rem;
`;

const Title = styled.h2`
  font-size: 3.5rem;
  margin-top: 1rem;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  position: relative;
  
  @media (max-width: 968px) {
    flex-direction: column;
    align-items: center;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50px;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--glass-border), transparent);
    z-index: 0;
    
    @media (max-width: 968px) {
      display: none;
    }
  }
`;

const StepCard = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  z-index: 1;
`;

const StepNumber = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 0 40px rgba(0, 242, 254, 0.05);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 50%;
    padding: 1px;
    background: linear-gradient(135deg, var(--color-secondary), transparent);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;

const StepTitle = styled.h4`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
`;

const StepDescription = styled.p`
  color: var(--color-text-dim);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  max-width: 300px;
`;

const steps = [
  {
    number: "01",
    title: "Browse Seats",
    description: "Discover verified AI subscription seats available for immediate takeover."
  },
  {
    number: "02",
    title: "Secure Purchase",
    description: "Our smart escrow system ensures your funds are safe until you gain access."
  },
  {
    number: "03",
    title: "Start Creating",
    description: "Get instant credentials and unlock the full power of premium AI models."
  }
];

export const Process: React.FC = () => (
  <ProcessWrapper>
    <SectionHeader>
      <Label>The Flow</Label>
      <Title>How it works</Title>
    </SectionHeader>
    <StepsContainer>
      {steps.map((step, idx) => (
        <StepCard
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: idx * 0.2 }}
        >
          <StepNumber>{step.number}</StepNumber>
          <StepTitle>{step.title}</StepTitle>
          <StepDescription>{step.description}</StepDescription>
        </StepCard>
      ))}
    </StepsContainer>
  </ProcessWrapper>
);
