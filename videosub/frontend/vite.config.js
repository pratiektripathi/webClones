import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The backend FastAPI server runs on port 8000 by default. All /api requests
// are proxied to it so the frontend can use same-origin relative URLs.
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
})
