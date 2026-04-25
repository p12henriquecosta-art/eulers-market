import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase';

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

const NavContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
`;

const BrandLink = styled(Link)`
  text-decoration: none;
`;

const Title = styled.span`
  font-family: var(--font-heading);
  font-size: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  padding: 0.45rem 1rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  font-family: var(--font-main);
  color: ${(p) => (p.$active ? 'var(--color-primary)' : 'var(--color-text-dim)')};
  background: ${(p) => (p.$active ? 'rgba(0, 242, 254, 0.08)' : 'transparent')};
  border: 1px solid ${(p) => (p.$active ? 'rgba(0, 242, 254, 0.2)' : 'transparent')};
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AccessButton = styled.button`
  padding: 0.6rem 1.25rem;
  font-size: 0.9rem;
  box-shadow: 0 4px 20px -4px rgba(0, 242, 254, 0.3);
  flex-shrink: 0;

  @media (max-width: 360px) {
    display: none;
  }
`;

const SecondaryButton = styled(Link)`
  padding: 0.6rem 1.25rem;
  font-size: 0.9rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleRequestAccess = () => {
    if (location.pathname === '/') {
      document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#waitlist');
    }
  };

  return (
    <HeaderWrapper>
      <NavContainer>
        <BrandLink to="/" aria-label="Euler's Market home">
          <Title>Euler's Market</Title>
        </BrandLink>

        <NavLinks aria-label="Primary navigation">
          <NavLink to="/" $active={location.pathname === '/'}>
            Marketplace
          </NavLink>
          <NavLink to="/support" $active={location.pathname === '/support'}>
            Support
          </NavLink>
        </NavLinks>

        <ButtonGroup>
          {user ? (
            <AccessButton onClick={() => navigate('/portal')}>
              Portal
            </AccessButton>
          ) : (
            <>
              <SecondaryButton to="/login">Log In</SecondaryButton>
              <AccessButton id="nav-request-access" onClick={handleRequestAccess}>
                Request Access
              </AccessButton>
            </>
          )}
        </ButtonGroup>
      </NavContainer>
    </HeaderWrapper>
  );
};
