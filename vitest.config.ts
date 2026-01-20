import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    watch: false,
    reporters: ["default"],
    include: [
      "src/**/*.{test,spec}.{ts,js}",
      "src/**/__tests__/**/*.{test,spec}.{ts,js}",
    ],
  },
});
