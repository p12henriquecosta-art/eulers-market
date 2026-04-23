import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WaitlistForm } from './components/WaitlistForm';
import { Footer } from './components/Footer';
import './styles/global.css';

export const App: React.FC = () => (
  <>
    <Header />
    <main>
      <section className="section">
        <div className="container">
          <Hero />
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

export default App;
