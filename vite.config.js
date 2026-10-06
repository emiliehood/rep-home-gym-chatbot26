import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Production builds are served from GitHub Pages at /rep-home-gym-chatbot26/,
// local dev stays at the root (localhost:5173).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/rep-home-gym-chatbot26/' : '/',
  plugins: [react()],
}))
