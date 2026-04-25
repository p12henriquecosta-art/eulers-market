import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  icon: string;
  title: string;
  items: FAQItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FAQ_DATA: FAQCategory[] = [
  {
    id: 'platform',
    icon: '∑',
    title: 'The Platform',
    items: [
      {
        id: 'what-is',
        question: "What is Euler's Market?",
        answer:
          "Euler's Market is a visionary marketplace designed for the exchange of AI subscription seats and compute credits. Our mission is to optimize global compute utilization by allowing users to liquidate unused subscription value and providing secondary market access to high-performance AI models at a fraction of the cost.",
      },
      {
        id: 'models',
        question: 'Which AI models and platforms are supported?',
        answer:
          'The platform is engineered to support a wide array of premium AI tools, including ChatGPT Plus, Claude Pro, Gemini Advanced, Midjourney, Perplexity Pro, GitHub Copilot, and emerging inference providers like Groq and Mistral Large.',
      },
      {
        id: 'status',
        question: 'What is the current development status of the platform?',
        answer:
          "Euler's Market is currently in the Visionary Phase, focusing on building the core agentic architecture. We are preparing for our first wave of alpha users and are currently launching a Private Beta.",
      },
      {
        id: 'waitlist',
        question: 'How do I join the waitlist?',
        answer:
          'If you have a subscription you would like to list or are seeking affordable access to the world\'s most powerful models, you can join the waitlist via our landing page to be notified when beta slots become available.',
      },
    ],
  },
  {
    id: 'security',
    icon: 'ε',
    title: 'Security & Escrow',
    items: [
      {
        id: 'zk-escrow',
        question: 'How does "Zero-Knowledge Escrow" ensure my security?',
        answer:
          'Our infrastructure utilizes a zero-knowledge architecture that allows you to trade compute capacity or session access without ever exposing your private API keys, credentials, or sensitive data to the counterparty.',
      },
      {
        id: 'gpu',
        question: 'Can I access global GPU clusters through the marketplace?',
        answer:
          'Yes. Beyond individual subscription seats, the market provides access to high-performance GPU clusters and premium AI infrastructure from any region, ensuring global scale for compute-heavy tasks.',
      },
    ],
  },
  {
    id: 'liquidity',
    icon: 'π',
    title: 'Liquidity & Economics',
    items: [
      {
        id: 'instant-liquidity',
        question: '"Instant Liquidity" in the context of AI subscriptions?',
        answer:
          'Instant Liquidity is our mechanism for converting the dormant value of an unused monthly subscription into spendable credits. Instead of losing value to the "Annual Subscription Trap," users can recoup their investment algorithmically through the secondary market.',
      },
    ],
  },
  {
    id: 'euler',
    icon: 'e',
    title: 'The Vision',
    items: [
      {
        id: 'who-is-euler',
        question: 'Who is Leonhard Euler, and how does he inspire this market?',
        answer:
          'Leonhard Euler was a Swiss polymath who revolutionized graph theory, topology, and complex analysis. We apply his legacy of mathematical precision and node-based optimization to solve the modern challenge of global compute redistribution.',
      },
    ],
  },
];

// ─── Web Worker inline (search filtering) ────────────────────────────────────
// Keeps the UI thread unblocked when the dataset grows.
const WORKER_CODE = `
self.onmessage = function(e) {
  const { query, data } = e.data;
  const q = query.toLowerCase().trim();
  if (!q) { self.postMessage(data); return; }
  const filtered = data.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    ),
  })).filter(cat => cat.items.length > 0);
  self.postMessage(filtered);
};
`;

function createSearchWorker(): Worker {
  const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

// ─── Animations ───────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ─── Styled Components ────────────────────────────────────────────────────────
const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 8rem 1rem 6rem;
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
  font-family: var(--font-heading);
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(135deg, #fff 0%, #fff 45%, rgba(255, 255, 255, 0.4) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.25rem;
`;

const PageSubtitle = styled(motion.p)`
  font-family: var(--font-main);
  font-size: 1.2rem;
  color: var(--color-text-dim);
  max-width: 620px;
  margin: 0 auto 3rem;
  line-height: 1.6;
`;

// Search bar
const SearchWrapper = styled(motion.div)`
  max-width: 560px;
  margin: 0 auto 4rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem 1rem 3.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  color: #fff;
  font-family: var(--font-main);
  font-size: 1rem;
  transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.12);
  }

  &::placeholder { color: rgba(255, 255, 255, 0.3); }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-primary);
  font-size: 1.1rem;
  pointer-events: none;
  opacity: 0.7;
`;

const SearchingIndicator = styled(motion.span)`
  position: absolute;
  right: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: var(--color-primary);
  letter-spacing: 0.08em;
`;

// Category grid
const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 580px), 1fr));
  gap: 1.75rem;
  max-width: 1220px;
  margin: 0 auto;
`;

const CategoryCard = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  overflow: hidden;
  transition: border-color 0.3s ease;

  &:hover { border-color: rgba(0, 242, 254, 0.18); }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--glass-border);
`;

const CategoryIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background: rgba(0, 242, 254, 0.1);
  border: 1px solid rgba(0, 242, 254, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--color-primary);
  flex-shrink: 0;
  background-image: linear-gradient(
    90deg,
    rgba(0, 242, 254, 0.05) 0%,
    rgba(79, 172, 254, 0.15) 50%,
    rgba(0, 242, 254, 0.05) 100%
  );
  background-size: 200% auto;
  animation: ${shimmer} 3s linear infinite;
`;

const CategoryTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
`;

// FAQ accordion item
const AccordionItem = styled.div`
  border-bottom: 1px solid var(--glass-border);
  &:last-child { border-bottom: none; }
`;

const AccordionTrigger = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2rem;
  background: ${(p) => (p.$open ? 'rgba(0, 242, 254, 0.04)' : 'transparent')};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
  font-family: var(--font-main);

  &:hover { background: rgba(255, 255, 255, 0.03); }
`;

const QuestionText = styled.span`
  font-size: 0.97rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

const Chevron = styled(motion.span)`
  color: var(--color-primary);
  font-size: 1.1rem;
  flex-shrink: 0;
  display: inline-block;
  opacity: 0.8;
`;

const AccordionContent = styled(motion.div)`
  overflow: hidden;
`;

const AnswerText = styled.p`
  padding: 0 2rem 1.5rem;
  font-family: var(--font-main);
  font-size: 0.95rem;
  color: var(--color-text-dim);
  line-height: 1.7;
`;

// Empty state
const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  grid-column: 1 / -1;
  color: var(--color-text-dim);

  span { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
  p { font-size: 1rem; }
`;

// Back link
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

// ─── Sub-components ───────────────────────────────────────────────────────────
const FAQAccordionItem: React.FC<{ item: FAQItem; searchQuery: string }> = ({
  item,
  searchQuery,
}) => {
  const [open, setOpen] = useState(false);

  // Auto-expand when search matches
  useEffect(() => {
    if (searchQuery.trim()) setOpen(true);
    else setOpen(false);
  }, [searchQuery]);

  return (
    <AccordionItem>
      <AccordionTrigger
        $open={open}
        onClick={() => setOpen((v) => !v)}
        id={`faq-trigger-${item.id}`}
        aria-expanded={open}
        aria-controls={`faq-panel-${item.id}`}
      >
        <QuestionText>{item.question}</QuestionText>
        <Chevron animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
          ⌃
        </Chevron>
      </AccordionTrigger>

      <AnimatePresence initial={false}>
        {open && (
          <AccordionContent
            id={`faq-panel-${item.id}`}
            role="region"
            aria-labelledby={`faq-trigger-${item.id}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
          >
            <AnswerText>{item.answer}</AnswerText>
          </AccordionContent>
        )}
      </AnimatePresence>
    </AccordionItem>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const SupportFAQ: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState<FAQCategory[]>(FAQ_DATA);
  const [isSearching, setIsSearching] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Boot worker once
  useEffect(() => {
    workerRef.current = createSearchWorker();
    workerRef.current.onmessage = (e: MessageEvent<FAQCategory[]>) => {
      setFilteredData(e.data);
      setIsSearching(false);
    };
    return () => workerRef.current?.terminate();
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsSearching(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      workerRef.current?.postMessage({ query: value, data: FAQ_DATA });
    }, 180);
  }, []);

  return (
    <PageWrapper>
      <div className="container">
        <BackLink
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          ← Back to Euler's Market
        </BackLink>

        <PageHeader>
          <EulerBadge
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            ✦ Support & FAQ
          </EulerBadge>

          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            Mathematical Clarity
          </PageTitle>

          <PageSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            Every question has a precise answer. Euler optimized graph traversal —
            we optimize your understanding of the marketplace.
          </PageSubtitle>

          <SearchWrapper
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <SearchIcon>⌕</SearchIcon>
            <SearchInput
              id="faq-search"
              type="search"
              placeholder="Search questions… e.g. 'escrow', 'GPU', 'waitlist'"
              value={query}
              onChange={handleSearch}
              aria-label="Search FAQ"
              autoComplete="off"
            />
            <AnimatePresence>
              {isSearching && (
                <SearchingIndicator
                  key="searching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  searching…
                </SearchingIndicator>
              )}
            </AnimatePresence>
          </SearchWrapper>
        </PageHeader>

        <CategoryGrid>
          <AnimatePresence>
            {filteredData.length === 0 ? (
              <EmptyState
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span>∅</span>
                <p>No results for "{query}". Try a different term.</p>
              </EmptyState>
            ) : (
              filteredData.map((cat, catIdx) => (
                <CategoryCard
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.6, delay: catIdx * 0.08, ease: EASE }}
                >
                  <CategoryHeader>
                    <CategoryIcon>{cat.icon}</CategoryIcon>
                    <CategoryTitle>{cat.title}</CategoryTitle>
                  </CategoryHeader>

                  {cat.items.map((item) => (
                    <FAQAccordionItem
                      key={item.id}
                      item={item}
                      searchQuery={query}
                    />
                  ))}
                </CategoryCard>
              ))
            )}
          </AnimatePresence>
        </CategoryGrid>
      </div>
    </PageWrapper>
  );
};
