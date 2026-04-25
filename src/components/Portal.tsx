import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const PortalWrapper = styled.div`
  padding: 6rem 0;
  max-width: 1000px;
  margin: 0 auto;
`;

const PortalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;
  padding: 0 var(--space-xl);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 var(--space-xl);
`;

const ElevatedCard = styled(motion.div)`
  /* QuestUI Elevated Card Style but adhering to Obsidian rules for border color glow */
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  /* Applying Obsidian Cyan/White but enabling the required Gold glow from user prompt constraints over interactive elements */
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: var(--glass-2-bg);
  backdrop-filter: blur(var(--glass-2-blur));
  -webkit-backdrop-filter: blur(var(--glass-2-blur));
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.04);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    border-color: rgba(202, 138, 4, 0.5); /* Primary Gold glow (#CA8A04) */
    box-shadow: 0 8px 32px rgba(202, 138, 4, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.04);
  }
`;

const KeyInput = styled.input`
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
  background: rgba(0,0,0,0.5);
`;

const ButtonDestructive = styled.button`
  background: transparent;
  color: #991B1B;
  border: 1px solid #991B1B;
  box-shadow: none;

  &:hover:not(:disabled) {
    background: rgba(153, 27, 27, 0.1);
    box-shadow: 0 4px 20px -4px rgba(153, 27, 27, 0.5);
    border-color: #EF4444;
    color: #EF4444;
  }
`;

export const Portal: React.FC = () => {
  const [accessKey, setAccessKey] = useState('EULR-XXXXXXXX-XXXX');

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <main>
      <PortalWrapper>
        <PortalHeader>
          <div>
            <div className="section-label" style={{ marginBottom: '0.5rem' }}>Customer Sanctuary</div>
            <h2>Command Center</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-text-dim)' }}>
              Node Identity: {auth.currentUser?.email}
            </p>
          </div>
          <button className="btn-secondary" onClick={handleLogout}>Terminate Session</button>
        </PortalHeader>

        <Grid>
          <ElevatedCard>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>Access Keys</h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
              Your API keys grant complete access to your autonomous scribes. Keep them secure.
            </p>
            <KeyInput 
              type="text" 
              value={accessKey} 
              readOnly 
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
              <button style={{ flex: 1 }}>Rotate Key</button>
              <ButtonDestructive style={{ flex: 1 }}>Revoke</ButtonDestructive>
            </div>
          </ElevatedCard>

          <ElevatedCard>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>System Health</h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>
              Monitor your node's connection to the primary subnet.
            </p>
            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Status</span>
                <span style={{ fontSize: '0.85rem', color: '#22C55E' }}>OPTIMAL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Latency</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>24ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Active Scribes</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text)' }}>0</span>
              </div>
            </div>
            <button className="btn-secondary" style={{ marginTop: 'auto' }}>View Full Metrics</button>
          </ElevatedCard>
        </Grid>
      </PortalWrapper>
    </main>
  );
};
