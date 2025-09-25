// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/moyuum_recommender/', // ← 저장소 이름과 정확히 일치
})
