import type { Plan } from './portal.types';

export const PLANS: Plan[] = [
  {
    id: 'early_access',
    name: 'Early Access',
    price: 0,
    desc: 'Community tier. Access the marketplace with limited scribe concurrency and public listings.',
    free: true,
  },
  {
    id: 'gpt4o',
    name: 'Early Access · ChatGPT',
    price: 9.99,
    desc: 'Unlock GPT-4o scribes. Priority queue, extended context window, and commercial usage rights.',
    free: false,
  },
  {
    id: 'claude',
    name: 'Early Access · Claude AI',
    price: 9.99,
    desc: 'Unlock Claude Sonnet scribes. Superior reasoning and 200K token documents, fully managed.',
    free: false,
  },
  {
    id: 'perplexity',
    name: 'Early Access · Perplexity',
    price: 9.99,
    desc: 'Real-time web intelligence. Perplexity-powered scribes with live search augmentation.',
    free: false,
  },
];
