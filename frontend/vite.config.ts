import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // or any port you prefer
  },
  root: '.', // Set the root to the current directory
  build: {
    outDir: 'build', // Output directory for the build
  },
});