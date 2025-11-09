import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Using Vite's default chunking. manualChunks was removed because it referenced
    // packages that aren't present in package.json on all branches which caused
    // production builds to fail when Rollup tried to create chunks for missing
    // modules. If you want manual chunking, we can programmatically derive the
    // list from package.json to avoid these issues.
  },
}));
