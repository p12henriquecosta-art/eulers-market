import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  margin-top: 3rem;
  padding: 1rem;
  font-size: 0.8rem;
  opacity: 0.5;
  color: var(--color-text);
`;

export const Footer: React.FC = () => (
  <FooterWrapper>
    &copy; {new Date().getFullYear()} Euler's Market. Built for the visionary age.
  </FooterWrapper>
);
