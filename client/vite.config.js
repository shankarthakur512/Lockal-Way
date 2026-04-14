import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiProxyTarget = "http://127.0.0.1:4001";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/sendmail": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/verify-otp": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/create-payment-intent": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/uploads": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
