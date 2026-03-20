import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Mantiene el nombre sin hash para assets específicos
        assetFileNames: (asset) => {
          if (asset.name === 'logo_Q-spoa.jpg') return 'assets/logo_Q-spoa.jpg';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
})
