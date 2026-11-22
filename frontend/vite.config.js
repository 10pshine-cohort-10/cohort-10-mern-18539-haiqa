import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:5000';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      // In development the browser calls /api on the Vite server and Vite forwards
      // it to Express. Same origin = no CORS problems and, from Week 2, cookies just work.
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true },
      },
    },
  };
});
