import { resolve } from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MyApp",
      fileName: "app",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "node:process",
        "node:readline/promises",
        "node:fs",
        "node:path",
        "node:http",
        "node:util",
      ],
      output: {
        inlineDynamicImports: true,
      },
    },
    minify: true,
    outDir: "dist",
    emptyOutDir: true,
  },
  ssr: {
    noExternal: true,
  },
});
