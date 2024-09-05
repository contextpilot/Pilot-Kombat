import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8080,
    host: '0.0.0.0' // Ensure the server listens on all network interfaces.
  },
  preview: {
    port: 8080,
    host: '0.0.0.0' // Ensure the preview server does the same.
  }
});