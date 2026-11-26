/// <reference types="vitest/config" />
import { defineConfig } from "vite";

// Builds the card and the editor panel straight into the integration, which
// serves and registers both automatically. Lit ends up in a shared chunk.
export default defineConfig({
  build: {
    lib: {
      entry: {
        "energiefluss-card": "src/cards.ts",
        "energiefluss-panel": "src/energiefluss-panel.ts",
      },
      formats: ["es"],
      fileName: (_format, name) => `${name}.js`,
    },
    rollupOptions: {
      output: {
        chunkFileNames: "energiefluss-shared-[hash].js",
      },
    },
    outDir: "../custom_components/energiefluss/frontend",
    emptyOutDir: true,
    target: "es2021",
    minify: true,
    sourcemap: false,
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
