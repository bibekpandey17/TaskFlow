import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: ' https://taskflow-v6xw.onrender.com', // ⚠️ Change this to your backend port if it's different (e.g. 3000)
        changeOrigin: true,
        secure: false,
      },
    },
  },
})