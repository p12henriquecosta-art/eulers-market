import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WaitlistForm } from './components/WaitlistForm';
import { Footer } from './components/Footer';
import './styles/global.css';

export const App: React.FC = () => (
  <div className="card">
    <Header />
    <Hero />
    <WaitlistForm />
    <Footer />
  </div>
);

export default App;
