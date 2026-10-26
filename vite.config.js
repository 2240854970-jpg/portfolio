import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  publicDir: 'public-site',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 4201,
    host: '127.0.0.1',
  },
  preview: {
    port: 4201,
    host: '127.0.0.1',
  },
})
