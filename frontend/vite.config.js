import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // allows LAN/localhost access
    port: 5173,
    hmr: {
      protocol: "ws",
      host: "localhost",  // force WebSocket host
      port: 5173,
    },
  },
});
