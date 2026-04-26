import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { schemaCompany } from '@schemacompany/vite'
import fs from 'fs'
import path from 'path'

const geoPath = path.resolve(__dirname, 'src/components/GEO.json');
let geoData = '{}';
try {
  geoData = fs.readFileSync(geoPath, 'utf-8');
} catch (e) {
  console.warn('Could not read GEO.json');
}

// Override fetch to serve the local GEO.json for @schemacompany/vite
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  if (url.toString().includes('theschemacompany.com')) {
    return new Response(geoData, {
      status: 200,
      headers: { 'Content-Type': 'application/ld+json' }
    });
  }
  return originalFetch(url, options);
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    schemaCompany({
      schemas: {
        '/': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    })
  ],

  build: {
    // Raise the warning threshold slightly — after splitting, individual vendor
    // chunks are allowed to be a little larger than the default 500 kB.
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // ── Manual vendor chunks ────────────────────────────────────────────
        // Groups stable, rarely-changing third-party libraries into dedicated
        // chunks so they can be cached independently across deployments.
        manualChunks: (id: string) => {
          // Firebase SDK — largest dep; split auth, firestore, and core apart
          // so each feature chunk is as small as possible.
          if (id.includes('firebase/app') || id.includes('@firebase/app')) {
            return 'vendor-firebase-core';
          }
          if (id.includes('firebase/auth') || id.includes('@firebase/auth')) {
            return 'vendor-firebase-auth';
          }
          if (id.includes('firebase/firestore') || id.includes('@firebase/firestore')) {
            return 'vendor-firebase-firestore';
          }
          // Framer Motion
          if (id.includes('framer-motion')) {
            return 'vendor-framer';
          }
          // Styled Components
          if (id.includes('styled-components')) {
            return 'vendor-styled';
          }
          // React core + React DOM + React Router
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('react-router-dom') || id.includes('react-router')) {
            return 'vendor-router';
          }
        },
      },
    },
  },
})
