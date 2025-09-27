import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/moyuum_recommender/',
  plugins: [react()],
});
