// vite.config.js (루트)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/moyuum_recommender/',   // ← 저장소명과 일치
  build: { outDir: 'dist' }       // ← dist 로 빌드
})
