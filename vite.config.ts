import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    // Enable code splitting for better caching and parallel loading
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'query': ['@tanstack/react-query'],
          'state': ['zustand'],
          'icons': ['lucide-react'],
          'utils': ['axios', 'date-fns'],
        },
      },
    },
    // Optimize for faster builds
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps in production (saves ~200KB)
  },
})
