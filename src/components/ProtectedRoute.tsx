import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Skeleton } from './ui/Skeleton';

const PortalSkeleton: React.FC = () => (
  <div style={{ padding: '7rem 2rem 4rem', maxWidth: 1200, margin: '0 auto' }}>
    {/* Header skeleton */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '40%' }}>
        <Skeleton.Line h="0.7rem" w="30%" />
        <Skeleton.Title w="60%" />
        <Skeleton.Line h="0.75rem" w="45%" />
      </div>
      <Skeleton.Button w="8rem" />
    </div>

    {/* Access Keys skeleton */}
    <Skeleton.Card>
      <Skeleton.Line h="0.7rem" w="20%" />
      <Skeleton.Title w="40%" />
      <Skeleton.Text lines={2} w="90%" />
      <Skeleton.Row>
        <Skeleton.Line h="2.4rem" w="100%" radius="8px" />
        <Skeleton.Button w="5rem" />
        <Skeleton.Button w="5rem" />
      </Skeleton.Row>
    </Skeleton.Card>

    {/* Plan cards skeleton */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', margin: '1.5rem 0' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton.Card key={i}>
          <Skeleton.Line h="1.2rem" w="3.5rem" radius="var(--radius-full)" />
          <Skeleton.Title w="80%" />
          <Skeleton.Line h="1.6rem" w="50%" />
          <Skeleton.Text lines={3} />
          <Skeleton.Button w="100%" />
        </Skeleton.Card>
      ))}
    </div>

    {/* History + billing skeleton */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
      {[0, 1].map(i => (
        <Skeleton.Card key={i}>
          <Skeleton.Line h="0.7rem" w="30%" />
          {Array.from({ length: 3 }).map((_, j) => (
            <Skeleton.TableRow key={j} cols={4} />
          ))}
        </Skeleton.Card>
      ))}
    </div>

    {/* Usage chart skeleton */}
    <Skeleton.Card>
      <Skeleton.Line h="0.7rem" w="25%" />
      <Skeleton.Title w="55%" />
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: 130, marginTop: '0.5rem' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton.Line
            key={i}
            h={`${40 + Math.round(Math.random() * 70)}px`}
            w="100%"
            radius="6px 6px 2px 2px"
          />
        ))}
      </div>
    </Skeleton.Card>
  </div>
);
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
