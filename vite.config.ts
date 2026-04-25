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
})
