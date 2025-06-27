import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/jigsaw-puzzle-game/',
  build: {
    outDir: 'docs'
  }
})