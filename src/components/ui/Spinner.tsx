import React from 'react';
import styled, { keyframes } from 'styled-components';

// ─── Spinner ──────────────────────────────────────────────────────────────────
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Ring = styled.span<{ $size?: string; $color?: string }>`
  display: inline-block;
  width: ${p => p.$size ?? '1em'};
  height: ${p => p.$size ?? '1em'};
  border: 2px solid transparent;
  border-top-color: ${p => p.$color ?? 'currentColor'};
  border-right-color: ${p => p.$color ?? 'currentColor'};
  border-radius: 50%;
  animation: ${spin} 0.65s linear infinite;
  flex-shrink: 0;
  vertical-align: middle;
`;

interface SpinnerProps {
  /** CSS size value, e.g. '1rem', '18px'. Defaults to '1em' (inherits font-size). */
  size?: string;
  /** Override colour. Defaults to currentColor. */
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size, color }) => (
  <Ring $size={size} $color={color} aria-hidden="true" />
);
