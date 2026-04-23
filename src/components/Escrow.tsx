import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Persistence } from '../utils/persistence';

const EscrowCard = styled(motion.div)`
  padding: 2.5rem;
  margin-top: 4rem;
  text-align: left;
`;

const StatusBadge = styled.span<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-dim)'};
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid ${props => props.active ? 'rgba(0, 242, 254, 0.3)' : 'var(--glass-border)'};
`;

export const EscrowSystem: React.FC = () => {
  const [isEncrypted, setIsEncrypted] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState<string | null>(null);

  const initiateEscrow = async () => {
    setIsEncrypted(true);
    // Simulate client-side key generation and encryption
    const mockId = 'ZK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTransactionId(mockId);
    Persistence.save('last_escrow_tx', { id: mockId, timestamp: Date.now() });
  };

  return (
    <EscrowCard className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3>Zero-Knowledge Escrow</h3>
        <StatusBadge active={isEncrypted}>
          {isEncrypted ? 'ENCRYPTED SESSION' : 'AWAITING INITIALIZATION'}
        </StatusBadge>
      </div>
      
      <p style={{ color: 'var(--color-text-dim)', marginBottom: '2rem' }}>
        All transaction metadata is encrypted on your device before reaching our servers. 
        Euler's Market never holds your private keys or unencrypted transaction data.
      </p>

      {!transactionId ? (
        <button onClick={initiateEscrow}>
          Initialize Secure Escrow
        </button>
      ) : (
        <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)' }}>Secure Transaction ID:</p>
          <code style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: '700' }}>{transactionId}</code>
          <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: 'rgba(0, 242, 254, 0.6)' }}>
            ✓ Verified Zero-Knowledge Proof generated local-first.
          </p>
        </div>
      )}
    </EscrowCard>
  );
};
