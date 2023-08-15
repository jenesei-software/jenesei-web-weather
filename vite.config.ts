import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        sourcemap: true,
      },
      injectManifest: {
        maximumFileSizeToCacheInBytes: 8000000
      }
    }),
  ],
})
