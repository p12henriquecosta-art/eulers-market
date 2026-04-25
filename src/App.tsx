import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Features } from './components/Features';
import { Process } from './components/Process';
import { WaitlistForm } from './components/WaitlistForm';
import { EscrowSystem } from './components/Escrow';
import { SupportFAQ } from './components/SupportFAQ';
import { Footer } from './components/Footer';
import './styles/global.css';

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

const SupportPage: React.FC = () => (
  <main>
    <SupportFAQ />
  </main>
);

// ─── Root App ─────────────────────────────────────────────────────────────────
export const App: React.FC = () => {
  useSpotlight();

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
