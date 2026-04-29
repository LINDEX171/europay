import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/auth': 'http://localhost:8081',
      '/api/accounts': 'http://localhost:8082',
      '/api/transactions': 'http://localhost:8083',
    },
  },
})
