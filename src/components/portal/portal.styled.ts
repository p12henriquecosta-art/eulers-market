import styled from 'styled-components';
import { motion } from 'framer-motion';

// ─── Layout ───────────────────────────────────────────────────────────────────
export const PortalWrapper = styled.div`
  padding: 7rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 640px) {
    padding: 5rem 1.25rem 3rem;
  }
`;

export const PortalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FullRow = styled.div`
  margin-bottom: 1.5rem;
`;

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = styled(motion.div)`
  padding: 1.75rem;
  border: 1px solid var(--glass-border);
  background: var(--glass-2-bg);
  backdrop-filter: blur(var(--glass-2-blur));
  -webkit-backdrop-filter: blur(var(--glass-2-blur));
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.04);
  transition: border-color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);

  &:hover {
    border-color: rgba(202, 138, 4, 0.35);
    box-shadow: 0 8px 32px rgba(202, 138, 4, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.04);
  }
`;

export const SubCard = styled.div`
  padding: 1.75rem;
  border: 1px solid var(--glass-border);
  background: var(--glass-1-bg);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    border-color: rgba(0, 242, 254, 0.2);
    box-shadow: 0 4px 24px rgba(0, 242, 254, 0.06);
  }
`;

// ─── Typography ───────────────────────────────────────────────────────────────
export const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
`;

export const SectionLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
`;

// ─── Form elements ────────────────────────────────────────────────────────────
export const InlineRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    
    button {
      width: 100%;
    }
  }

  input {
    flex: 1;
  }
`;

export const SmBtn = styled.button`
  padding: 0.55rem 1.1rem;
  font-size: 0.85rem;
  white-space: nowrap;
`;

export const DestructiveBtn = styled.button`
  background: transparent;
  color: #991B1B;
  border: 1px solid #991B1B;
  box-shadow: none;
  padding: 0.55rem 1.1rem;
  font-size: 0.85rem;

  &:hover:not(:disabled) {
    background: rgba(153, 27, 27, 0.1);
    box-shadow: 0 4px 20px -4px rgba(153, 27, 27, 0.4);
    border-color: #EF4444;
    color: #EF4444;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -1.75rem;
  padding: 0 1.75rem;
  
  @media (max-width: 640px) {
    margin: 0 -1.25rem;
    padding: 0 1.25rem;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 500px;
  border-collapse: collapse;
  font-size: 0.88rem;
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.6rem 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--glass-border);
`;

export const Td = styled.td`
  padding: 0.85rem 1rem;
  color: var(--color-text-dim);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  vertical-align: middle;

  &:first-child {
    color: var(--color-text-muted);
    font-size: 0.82rem;
  }
`;

export const StatusPill = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  background: ${p =>
    p.$status === 'Completed' ? 'rgba(34,197,94,0.1)' :
    p.$status === 'Pending'   ? 'rgba(202,138,4,0.1)' :
    'rgba(239,68,68,0.1)'
  };
  color: ${p =>
    p.$status === 'Completed' ? '#22C55E' :
    p.$status === 'Pending'   ? '#CA8A04' :
    '#EF4444'
  };

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

// ─── Billing ──────────────────────────────────────────────────────────────────
export const InvoiceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  font-size: 0.88rem;
  color: var(--color-text-dim);

  &:last-child { border-bottom: none; }
`;

// ─── Shared animation preset ──────────────────────────────────────────────────
export const cardAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
