import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const targetURL = 'http://localhost:8000/';

const proxyConfig = {
  '/api': {},
  '/images': {},
};

Object.keys(proxyConfig).forEach((route) => {
  proxyConfig[route].target = targetURL;
});
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: proxyConfig,
  },
});