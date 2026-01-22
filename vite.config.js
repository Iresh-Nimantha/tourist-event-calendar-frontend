import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ["@fullcalendar/core", "@fullcalendar/react"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ["dotenv"],
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "axios"],
          calendar: ["@fullcalendar/core", "@fullcalendar/react"],
        },
      },
    },
  },
});
