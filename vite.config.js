import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Set VITE_BASE_PATH=/ for a custom-domain deployment.
  base: process.env.VITE_BASE_PATH ?? '/AMIC_Pugh/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
});
