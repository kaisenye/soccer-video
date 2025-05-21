import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173,
    proxy: {
      '/api/trace': {
        target: 'https://lapi.traceup.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trace/, ''),
        secure: false,
        headers: {
          'Referer': 'https://lapi.traceup.com'
        }
      }
    }
  },
  base: '/',
  css: {
    postcss: './postcss.config.js',
  },
})
