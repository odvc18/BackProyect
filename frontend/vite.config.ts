import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@theme': path.resolve(__dirname, './src/theme'),
      '@constants': path.resolve(__dirname, './src/constants'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/identity': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        // No reescribir, mantener /api/identity
      },
      '/api/contest': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        // No reescribir, mantener /api/contest
      },
      '/api/submission': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        // No reescribir, mantener /api/submission
      },
      '/api/evaluation': {
        target: 'http://localhost:5004',
        changeOrigin: true,
        // No reescribir, mantener /api/evaluation
      },
      '/api/ai-analysis': {
        target: 'http://localhost:5005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})



