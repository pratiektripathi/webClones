import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The backend FastAPI server runs on port 8000 by default. All /api requests
// are proxied to it so the frontend can use same-origin relative URLs.
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:8000'

// Set VITE_ALLOW_ALL_HOSTS=true to accept requests from any host (e.g. when
// exposing the dev server through a tunnel such as cloudflared/ngrok).
const ALLOW_ALL_HOSTS = process.env.VITE_ALLOW_ALL_HOSTS === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ALLOW_ALL_HOSTS ? true : undefined,
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
})
