import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterWrapper = styled.footer`
  margin-top: 3rem;
  padding: 1rem;
  font-size: 0.8rem;
  opacity: 0.5;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const FooterLink = styled(Link)`
  color: var(--color-primary);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
    text-shadow: 0 0 8px rgba(0, 242, 254, 0.4);
  }
`;

export const Footer: React.FC = () => (
  <FooterWrapper>
    <span>&copy; {new Date().getFullYear()} Euler's Market. Built for the visionary age.</span>
    <FooterLink to="/terms">Terms of Systemic Command</FooterLink>
  </FooterWrapper>
);
