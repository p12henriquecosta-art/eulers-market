import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { PortalWrapper, PortalHeader, FullRow } from './portal/portal.styled';
import { PortalAccessKeys } from './portal/PortalAccessKeys';
import { PortalPlans } from './portal/PortalPlans';
import { PortalHistory } from './portal/PortalHistory';
import { PortalUsage } from './portal/PortalUsage';

export const Portal: React.FC = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <main>
      <PortalWrapper>
        {/* ── Header ── */}
        <PortalHeader>
          <div>
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>Customer Sanctuary</div>
            <h2 style={{ marginBottom: '0.35rem' }}>Command Center</h2>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
              {user?.email}
            </p>
          </div>
          <button className="btn-secondary" onClick={handleLogout}>Terminate Session</button>
        </PortalHeader>

        {/* ── Access Keys ── */}
        <FullRow>
          <PortalAccessKeys />
        </FullRow>

        {/* ── Subscription Plans ── */}
        <PortalPlans />

        {/* ── Purchase History + Billing ── */}
        <PortalHistory />

        {/* ── Usage Chart ── */}
        <PortalUsage />
      </PortalWrapper>
    </main>
  );
};
