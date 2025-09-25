import { defineConfig } from 'vite'

// 리포지토리명이 'moyuum_recommender' 라면:
export default defineConfig({
  base: '/moyuum_recommender/',
  build: {
    outDir: 'dist'
  }
})
