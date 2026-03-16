import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
