/**
 * i18n.ts — Zero-cookie, zero-redirect language detection
 *
 * Detection order:
 *  1. navigator.language (browser preference)
 *  2. navigator.languages[0] (secondary preference)
 *  Fallback: 'en'
 *
 * Supported: en, pt (pt-PT + pt-BR), es (all Spanish locales)
 * No localStorage, no cookies, no redirects — purely reactive.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import pt from '../locales/pt.json';
import es from '../locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      es: { translation: es },
    },

    // Supported language codes — the detector maps sub-tags automatically
    // e.g. 'pt-PT' → 'pt', 'es-MX' → 'es'
    supportedLngs: ['en', 'pt', 'es'],

    // Silent fallback to English for any unsupported locale
    fallbackLng: 'en',

    detection: {
      // Read from browser only — no cookies, no localStorage
      order: ['navigator'],
      caches: [], // ← zero persistence
    },

    interpolation: {
      // React already escapes values — no double-escaping needed
      escapeValue: false,
    },
  });

export default i18n;
