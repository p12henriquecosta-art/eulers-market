import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(2, 4, 8, 0.7);
  border-bottom: 1px solid var(--glass-border);
`;

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const Header: React.FC = () => (
  <HeaderWrapper>
    <Title>Euler's Market</Title>
  </HeaderWrapper>
);
