import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ToastProvider } from './components/ui/Toast';
import { Skeleton } from './components/ui/Skeleton';
import './styles/global.css';

// ─── Eagerly-loaded home-page atoms ─────────────────────────────────────────
// These render above the fold and must not be deferred.
import { Hero }        from './components/Hero';
import { Stats }       from './components/Stats';
import { Features }    from './components/Features';
import { Process }     from './components/Process';
import { WaitlistForm }from './components/WaitlistForm';
import { EscrowSystem }from './components/Escrow';
import { Footer }      from './components/Footer';

// ─── Route-level lazy bundles ────────────────────────────────────────────────
// Each lazy() creates its own JS chunk that is downloaded only when the user
// navigates to that route. Eliminates the 764 kB monolithic bundle warning.
const AuthGate      = lazy(() => import('./components/AuthGate').then(m => ({ default: m.AuthGate })));
const Portal        = lazy(() => import('./components/Portal').then(m => ({ default: m.Portal })));
const SupportFAQ    = lazy(() => import('./components/SupportFAQ').then(m => ({ default: m.SupportFAQ })));
const TermsConditions = lazy(() => import('./components/TermsConditions').then(m => ({ default: m.TermsConditions })));
const ProtectedRoute  = lazy(() => import('./components/ProtectedRoute').then(m => ({ default: m.ProtectedRoute })));

// ─── Suspense fallbacks ───────────────────────────────────────────────────────

/** Generic centred spinner for Auth / Support / Terms pages */
const PageSpinner: React.FC = () => (
  <div style={{
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    padding: '2rem',
  }}>
    <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Skeleton.Title w="60%" />
      <Skeleton.Text lines={3} />
      <Skeleton.Button w="100%" />
    </div>
  </div>
);

/** Portal-shape skeleton — mirrors the real dashboard layout so the transition
 *  feels seamless even before the lazy chunk arrives. */
const PortalPageFallback: React.FC = () => (
  <div style={{ padding: '7rem 2rem 4rem', maxWidth: 1200, margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '35%' }}>
        <Skeleton.Line h="0.7rem" w="30%" />
        <Skeleton.Title w="55%" />
        <Skeleton.Line h="0.75rem" w="40%" />
      </div>
      <Skeleton.Button w="8rem" />
    </div>
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
  </div>
);

// ─── Spotlight hook (non-blocking via rAF) ────────────────────────────────────
function useSpotlight() {
  useEffect(() => {
    let frameId: number;
    const handle = (e: MouseEvent) => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      });
    };
    window.addEventListener('mousemove', handle);
    return () => {
      window.removeEventListener('mousemove', handle);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);
}

// ─── Pages ────────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => (
  <main>
    <section className="section">
      <div className="container">
        <Hero />
      </div>
    </section>

    <Stats />

    <section className="section">
      <div className="container">
        <Features />
      </div>
    </section>

    <section className="section">
      <div className="container">
        <Process />
      </div>
    </section>

    <section className="section" id="waitlist">
      <div className="container">
        <WaitlistForm />
        <EscrowSystem />
      </div>
    </section>
  </main>
);

// ─── Root App ─────────────────────────────────────────────────────────────────
export const App: React.FC = () => {
  useSpotlight();

  return (
    <ToastProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/"       element={<HomePage />} />

          <Route path="/support" element={
            <Suspense fallback={<PageSpinner />}>
              <main><SupportFAQ /></main>
            </Suspense>
          } />

          <Route path="/terms" element={
            <Suspense fallback={<PageSpinner />}>
              <TermsConditions />
            </Suspense>
          } />

          <Route path="/login" element={
            <Suspense fallback={<PageSpinner />}>
              <AuthGate mode="login" />
            </Suspense>
          } />

          <Route path="/signup" element={
            <Suspense fallback={<PageSpinner />}>
              <AuthGate mode="signup" />
            </Suspense>
          } />

          <Route path="/portal" element={
            <Suspense fallback={<PortalPageFallback />}>
              <ProtectedRoute>
                <Portal />
              </ProtectedRoute>
            </Suspense>
          } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
