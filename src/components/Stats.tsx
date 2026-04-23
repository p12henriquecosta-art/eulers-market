import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StatsWrapper = styled.section`
  padding: 4rem 0;
  width: 100%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  font-family: var(--font-heading);
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #fff 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.8rem;
  font-weight: 600;
`;

const stats = [
  { value: "15k+", label: "Seats Exchanged" },
  { value: "65%", label: "Avg. Cost Saved" },
  { value: "48", label: "Supported Tools" }
];

export const Stats: React.FC = () => (
  <StatsWrapper>
    <div className="container">
      <StatsGrid className="glass-panel">
        {stats.map((stat, idx) => (
          <StatItem
            key={idx}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
          >
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatItem>
        ))}
      </StatsGrid>
    </div>
  </StatsWrapper>
);
