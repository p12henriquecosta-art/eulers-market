import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FeaturesWrapper = styled.section`
  padding: 4rem 0;
  width: 100%;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  padding: 3rem 2rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #000;
  box-shadow: 0 8px 16px -4px rgba(0, 242, 254, 0.3);
`;

const CardTitle = styled.h4`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
`;

const CardText = styled.p`
  color: var(--color-text-dim);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

const features = [
  {
    icon: "🤝",
    title: "Peer-to-Peer",
    text: "Directly exchange unused subscription seats with other professionals. No middlemen, just pure value."
  },
  {
    icon: "🛡️",
    title: "Secure Escrow",
    text: "Payments are held in escrow until seat access is verified. Your security is our top priority."
  },
  {
    icon: "🌍",
    title: "Global Access",
    text: "Access premium AI tools from anywhere in the world, regardless of local billing restrictions."
  }
];

export const Features: React.FC = () => (
  <FeaturesWrapper>
    <Grid>
      {features.map((feature, idx) => (
        <FeatureCard 
          key={idx}
          className="glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <IconWrapper>{feature.icon}</IconWrapper>
          <CardTitle>{feature.title}</CardTitle>
          <CardText>{feature.text}</CardText>
        </FeatureCard>
      ))}
    </Grid>
  </FeaturesWrapper>
);
