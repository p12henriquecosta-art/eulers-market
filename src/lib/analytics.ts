/**
 * analytics.ts — Thin, typed wrapper around GA4 (gtag.js)
 *
 * Usage:
 *   import { track } from '../lib/analytics';
 *   track.subscribeClicked({ plan: 'Claude AI', price: 9.99 });
 *
 * Gracefully no-ops when:
 *   - VITE_GA4_MEASUREMENT_ID is not set
 *   - window.gtag is not initialised yet (SSR guard)
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

// ─── Bootstrap ────────────────────────────────────────────────────────────────
// Injects the gtag.js script and initialises the data layer exactly once.
// Call this from main.tsx or App.tsx before any event fires.
export function initAnalytics(): void {
  if (!MEASUREMENT_ID) {
    console.info('[Analytics] VITE_GA4_MEASUREMENT_ID not set — tracking disabled.');
    return;
  }
  if (document.getElementById('ga4-script')) return; // already injected

  // data layer init (must happen before the script loads)
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false, // we fire page_view manually via usePageView
  });

  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

// ─── Internal helper ──────────────────────────────────────────────────────────
function gtag(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params ?? {});
}

// ─── Typed event catalog ──────────────────────────────────────────────────────
// Each function maps to one GA4 custom event. Parameters are strictly typed
// so misspellings surface at compile time, not at analysis time.

export const track = {
  // ── Page view (fired by usePageView on every route change) ──────────────
  pageView(params: { page_path: string; page_title?: string }): void {
    if (!MEASUREMENT_ID) return;
    window.gtag?.('event', 'page_view', {
      page_path:     params.page_path,
      page_title:    params.page_title ?? document.title,
      send_to:       MEASUREMENT_ID,
    });
  },

  // ── Auth ─────────────────────────────────────────────────────────────────
  signupComplete(params: { method: 'email' | 'google' | 'github' }): void {
    gtag('sign_up', { method: params.method });
  },

  loginComplete(params: { method: 'email' | 'google' | 'github' }): void {
    gtag('login', { method: params.method });
  },

  // ── Waitlist ──────────────────────────────────────────────────────────────
  waitlistJoin(params: { email_domain: string }): void {
    gtag('waitlist_join', params);
  },

  waitlistSignupRedirect(): void {
    gtag('waitlist_signup_redirect');
  },

  // ── Portal — subscriptions ────────────────────────────────────────────────
  subscribeClicked(params: { plan: string; price: number }): void {
    // Also fires the GA4 standard 'begin_checkout' so it shows in the
    // e-commerce funnel if the property has Enhanced E-commerce enabled.
    gtag('begin_checkout', {
      currency: 'EUR',
      value:    params.price,
      items: [{ item_name: params.plan, price: params.price, quantity: 1 }],
    });
    gtag('subscribe_clicked', { plan: params.plan, price: params.price });
  },

  // ── Portal — access keys ──────────────────────────────────────────────────
  keySaved(): void {
    gtag('integration_key_saved');
  },

  // ── Navigation CTAs ───────────────────────────────────────────────────────
  navCtaClicked(params: { cta: 'request_access' | 'portal' | 'ticker_quote' }): void {
    gtag('nav_cta_clicked', params);
  },

  // ── Quote ticker ──────────────────────────────────────────────────────────
  quoteTickerClicked(params: { company: string; href: string }): void {
    gtag('quote_ticker_clicked', params);
  },

  // ── Generic event (used for ad-hoc tracking) ──────────────────────────────
  event(eventName: string, params?: Record<string, unknown>): void {
    gtag(eventName, params);
  },
};
