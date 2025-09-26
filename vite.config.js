// vite.config.js (루트)
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/moyuum_recommender/',   // ← 저장소명과 일치
  build: { outDir: 'dist' }       // ← dist 로 빌드
})
