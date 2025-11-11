// vite.config.js
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import compression from 'vite-plugin-compression';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
    Inspect(),
    compression({
      algorithm: 'brotliCompress', // Use Brotli (better compression ratio)
      threshold: 10240, // Only compress files larger than 10 KB
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Clean import paths
    },
  },
  build: {
    sourcemap: process.env.NODE_ENV !== 'production', // Source maps only in development
    minify: 'esbuild', // Fastest minifier
    target: 'esnext', // Latest ECMAScript for better performance
    assetsInlineLimit: 4096, // Inline small assets (4 KB)
    cssCodeSplit: true, // Split CSS for better caching
    chunkSizeWarningLimit: 1500, // Increased limit for larger chunks
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  server: {
    fs: {
      allow: [
        path.resolve(__dirname), // allow project root
        path.resolve(__dirname, 'src'), // allow src
      ],
    },
    open: true, // Auto-open browser on server start
    hmr: {
      overlay: true, // Show full-screen error overlay in development
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'], // Pre-bundle essential dependencies
    exclude: ['redux-logger'], // Exclude unnecessary packages
  },
  esbuild: {
    jsx: 'automatic', // Improved JSX support
    keepNames: true, // Preserve function names for better debugging
  },
});
