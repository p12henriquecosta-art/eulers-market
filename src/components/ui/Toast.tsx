import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ─────────────────────────────────────────────────────────────────────
type ToastKind = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

// ─── Styles ────────────────────────────────────────────────────────────────────
const progressShrink = keyframes`
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
`;

const Container = styled.div`
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  pointer-events: none;

  @media (max-width: 480px) {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
`;

const ToastBox = styled(motion.div)<{ $kind: ToastKind }>`
  pointer-events: all;
  position: relative;
  min-width: 280px;
  max-width: 380px;
  padding: 0.9rem 1.1rem;
  padding-bottom: 1.25rem;
  border-radius: var(--radius-lg, 12px);
  border: 1px solid ${p =>
    p.$kind === 'success' ? 'rgba(34,197,94,0.35)' :
    p.$kind === 'error'   ? 'rgba(239,68,68,0.35)' :
    'rgba(0,242,254,0.35)'
  };
  background: ${p =>
    p.$kind === 'success' ? 'rgba(6,21,12,0.88)' :
    p.$kind === 'error'   ? 'rgba(21,6,6,0.88)'  :
    'rgba(4,12,20,0.88)'
  };
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.45),
    inset 0 1px 0 rgba(255,255,255,0.05),
    0 0 20px -4px ${p =>
      p.$kind === 'success' ? 'rgba(34,197,94,0.2)' :
      p.$kind === 'error'   ? 'rgba(239,68,68,0.2)' :
      'rgba(0,242,254,0.2)'
    };
  overflow: hidden;
`;

const Icon = styled.span<{ $kind: ToastKind }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  background: ${p =>
    p.$kind === 'success' ? 'rgba(34,197,94,0.2)' :
    p.$kind === 'error'   ? 'rgba(239,68,68,0.2)' :
    'rgba(0,242,254,0.2)'
  };
  color: ${p =>
    p.$kind === 'success' ? '#22C55E' :
    p.$kind === 'error'   ? '#EF4444' :
    'var(--color-primary)'
  };
`;

const Message = styled.p`
  font-size: 0.875rem;
  color: var(--color-text, #e2e8f0);
  margin: 0;
  line-height: 1.4;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
`;

const Progress = styled.div<{ $kind: ToastKind; $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  transform-origin: left;
  animation: ${progressShrink} ${p => p.$duration}ms linear forwards;
  background: ${p =>
    p.$kind === 'success' ? '#22C55E' :
    p.$kind === 'error'   ? '#EF4444' :
    'var(--color-primary)'
  };
`;

const DURATION = 3800; // ms visible

const ICON: Record<ToastKind, string> = {
  success: '✓',
  error:   '✕',
  info:    'i',
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), DURATION + 400);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <Container>
          <AnimatePresence>
            {toasts.map(t => (
              <ToastBox
                key={t.id}
                $kind={t.kind}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              >
                <Row>
                  <Icon $kind={t.kind}>{ICON[t.kind]}</Icon>
                  <Message>{t.message}</Message>
                </Row>
                <Progress $kind={t.kind} $duration={DURATION} />
              </ToastBox>
            ))}
          </AnimatePresence>
        </Container>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
