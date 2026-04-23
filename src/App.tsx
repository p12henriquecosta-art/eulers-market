import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Features } from './components/Features';
import { Process } from './components/Process';
import { WaitlistForm } from './components/WaitlistForm';
import { Footer } from './components/Footer';
import './styles/global.css';

export const App: React.FC = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <Header />
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
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default App;
