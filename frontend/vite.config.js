import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: 'inline',
    minify: 'terser',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/main.jsx'),
        options: path.resolve(__dirname, 'src/options/main.jsx'),
        contentScript: path.resolve(__dirname, 'src/contentScript.js'),
        background: path.resolve(__dirname, 'src/background.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    strictPort: false,
  },
});
