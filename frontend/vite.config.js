import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/xposed': {
        target: 'https://api.xposedornot.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/xposed/, '/v1')
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
