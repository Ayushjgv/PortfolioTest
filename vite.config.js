import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        // Split the big, rarely-changing vendors so a content edit doesn't
        // invalidate the framework chunk in the user's cache.
        // (Rolldown requires the function form of manualChunks.)
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('motion') || id.includes('framer-motion')) return 'motion'
          if (id.includes('react-router') || id.includes('react-dom') || /[\\/]react[\\/]/.test(id))
            return 'react'
          return 'vendor'
        },
      },
    },
  },
})
