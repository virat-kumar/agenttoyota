import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // (optional) for `npm run dev`
  server: {
    allowedHosts: ['machine-virat.eastus2.cloudapp.azure.com'],
  },

  // required for `vite preview` (what your systemd service runs)
  preview: {
    host: true,                 // listen on all interfaces
    port: 3000,                 // matches your service + Nginx
    allowedHosts: ['machine-virat.eastus2.cloudapp.azure.com'],
  },
})