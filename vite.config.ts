import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // ✅ PATH ALIAS
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // ✅ DEVELOPMENT SERVER
  server: {
    port: 5173,
    host: true,
    open: true
  },
  
  // ✅ PRODUCTION BUILD
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  
  // ✅ ENVIRONMENT VARIABLES
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
  
  // ✅ OPTIMIZATIONS
  optimizeDeps: {
    include: ['lucide-react']
  },
  
  // ✅ CSS + POSTCSS for Tailwind v3 (DYNAMIC IMPORTS ✅)
  css: {
    postcss: './postcss.config.js',  // ✅ Reference config file
  },
  
  preview: {
    port: 4173,
    host: true
  }
})
