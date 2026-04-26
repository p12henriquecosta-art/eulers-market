import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SkeletonBase = styled.div<{ $h?: string; $w?: string; $radius?: string }>`
  height: ${p => p.$h ?? '1rem'};
  width: ${p => p.$w ?? '100%'};
  border-radius: ${p => p.$radius ?? '6px'};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.09) 40%,
    rgba(255, 255, 255, 0.04) 80%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
  flex-shrink: 0;
`;

// ─── Skeleton atoms ───────────────────────────────────────────────────────────
export const Skeleton = {
  Line: ({ h, w, radius }: { h?: string; w?: string; radius?: string }) => (
    <SkeletonBase $h={h} $w={w} $radius={radius} />
  ),
  Title: ({ w = '60%' }: { w?: string }) => (
    <SkeletonBase $h="1.1rem" $w={w} $radius="8px" />
  ),
  Text: ({ w = '100%', lines = 2 }: { w?: string; lines?: number }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase key={i} $h="0.85rem" $w={i === lines - 1 ? '70%' : w} $radius="5px" />
      ))}
    </div>
  ),
  Button: ({ w = '6rem' }: { w?: string }) => (
    <SkeletonBase $h="2.2rem" $w={w} $radius="var(--radius-md, 8px)" />
  ),
  Card: ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        padding: '1.75rem',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: 'var(--radius-xl, 16px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {children}
    </div>
  ),
  Row: ({ gap = '0.75rem', children }: { gap?: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>{children}</div>
  ),
  TableRow: ({ cols = 4 }: { cols?: number }) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '1rem',
        padding: '0.85rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBase key={i} $h="0.85rem" $w={i === 0 ? '60%' : '80%'} $radius="5px" />
      ))}
    </div>
  ),
};
