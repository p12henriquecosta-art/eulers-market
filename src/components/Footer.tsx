import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterWrapper = styled.footer`
  margin-top: 6rem;
  padding: 3rem 2rem;
  border-top: 1px solid var(--glass-border);
  background: linear-gradient(to bottom, transparent, rgba(0, 242, 254, 0.02));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
`;

const FooterBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  opacity: 0.5;
  font-size: 0.8rem;
`;

const FooterLink = styled(Link)`
  color: var(--color-text-dim);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const ExternalLink = styled.a`
  color: var(--color-text-dim);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const SocialGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

export const Footer: React.FC = () => (
  <FooterWrapper>
    <div className="rule-cyan" style={{ marginBottom: '1rem' }} />
    <SocialGroup>
      <ExternalLink href="https://www.instagram.com/euler.life/" target="_blank" rel="noopener noreferrer">
        Instagram
      </ExternalLink>
      <ExternalLink href="#" onClick={e => e.preventDefault()}>
        X / Twitter
      </ExternalLink>
    </SocialGroup>
    
    <FooterBottom>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <FooterLink to="/terms">Terms of Command</FooterLink>
        <FooterLink to="/support">Market Support</FooterLink>
      </div>
      <span>&copy; {new Date().getFullYear()} Euler's Market. All systems synchronized.</span>
    </FooterBottom>
  </FooterWrapper>
);
