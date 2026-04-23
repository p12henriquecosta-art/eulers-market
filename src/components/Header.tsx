import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  padding: 2rem;
  text-align: center;
  color: var(--color-text);
`;

const Title = styled.h1`
  font-family: var(--font-heading);
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const Identity = styled.div`
  font-family: 'serif';
  font-style: italic;
  font-size: 1.1rem;
  opacity: 0.4;
  margin-top: 0.5rem;
  letter-spacing: 0.2rem;
`;

export const Header: React.FC = () => (
  <HeaderWrapper>
    <Title>Euler's Market</Title>
    <Identity>e^iπ + 1 = 0</Identity>
  </HeaderWrapper>
);
