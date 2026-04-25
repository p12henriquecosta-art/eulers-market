import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 8rem 1rem 6rem;
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Spectral:wght@400;600&display=swap');
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const EulerBadge = styled(motion.span)`
  display: inline-block;
  padding: 0.4rem 1.25rem;
  border-radius: 100px;
  background: rgba(0, 242, 254, 0.08);
  border: 1px solid rgba(0, 242, 254, 0.25);
  color: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 1.75rem;
`;

const PageTitle = styled(motion.h1)`
  font-family: 'Cinzel', serif;
  font-size: clamp(2.8rem, 6vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  background: linear-gradient(135deg, #fff 0%, #fff 45%, rgba(255, 255, 255, 0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.25rem;
`;

const ContentCard = styled(motion.article)`
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 4rem;
  color: var(--color-text-dim);
  line-height: 1.8;
  font-family: 'Spectral', serif;
  
  h2 {
    color: #fff;
    font-family: 'Cinzel', serif;
    font-size: 1.5rem;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    position: relative;
    padding-bottom: 0.5rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: var(--color-primary);
      box-shadow: 0 0 8px rgba(0, 242, 254, 0.6);
    }
  }

  p {
    margin-bottom: 1.5rem;
  }

  strong {
    color: #fff;
  }

  ul {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
    li {
      margin-bottom: 0.5rem;
      &::marker {
        color: var(--color-primary);
      }
    }
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const BackLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-dim);
  font-size: 0.9rem;
  text-decoration: none;
  margin-bottom: 3rem;
  transition: color 0.2s ease;

  &:hover { color: var(--color-primary); }
`;

export const TermsConditions: React.FC = () => {
  return (
    <PageWrapper>
      <div className="container">
        <BackLink
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          ← Return to the Void
        </BackLink>
        <PageHeader>
          <EulerBadge
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            ✦ The Mercenary Contract
          </EulerBadge>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            Terms of Systemic Command
          </PageTitle>
        </PageHeader>

        <ContentCard
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <p>
            Welcome to the zero-trust architecture of Euler's Market. By accessing our platform, you embrace the transition from sight to systemic command. These terms govern your engagement within our deep obsidian void.
          </p>

          <h2>1. Absolute Logic &amp; Zero-Trust Verification</h2>
          <p>
            All transactions within Euler's Market are governed by strict zero-trust verification protocols. The platform facilitates the secure transmission of compute and subscription credentials through cryptographic escrow. We do not store your raw credentials, nor do we assume liability for their external compromise.
          </p>

          <h2>2. Mercenary Execution</h2>
          <p>
            As a user of Euler's Market, you act as an autonomous node in our network. You retain ultimate responsibility for the ethical and legal implications of the AI models accessed through our proxy nodes. We provide the vector lines of connection; you supply the intent.
          </p>

          <h2>3. Algorithmic Liquidity &amp; Fees</h2>
          <p>
            Euler's Market provides instantaneous algorithmic liquidity for your dormant subscription seats. In exchange for forging these pathways, the platform extracts a minimal, transparent transaction fee mathematically calculated to sustain the network.
          </p>
          <ul>
            <li><strong>Sellers:</strong> Yield returns according to the demand curves of our algorithmic pricing model.</li>
            <li><strong>Buyers:</strong> Gain fractional, high-performance access at a systemic discount.</li>
          </ul>

          <h2>4. Termination of the Void Link</h2>
          <p>
            We reserve the absolute right to sever the vector link to any node (user) found to be attempting sybil attacks, API key exfiltration, or violation of underlying service provider agreements. Upon termination, active escrows will be settled algorithmically based on the exact timestamp of disconnection.
          </p>

          <h2>5. Mathematical Freedom</h2>
          <p>
            Your access to this service is provided "as is," without warranties. The true pursuit of systemic command requires embracing uncertainty while relying on unyielding mathematical law.
          </p>
        </ContentCard>
      </div>
    </PageWrapper>
  );
};
