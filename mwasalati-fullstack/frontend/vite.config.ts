import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Port pinned to 3000 to match the existing Mwasalati sandbox convention
// (Vite's default of 5173 is intentionally overridden here).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
});
