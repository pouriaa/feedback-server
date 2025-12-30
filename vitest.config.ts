import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  test: {
    globals: true,
    environment: "node", // Not jsdom - we're testing server code
    include: ["src/__tests__/**/*.test.ts"],
    setupFiles: [path.resolve(__dirname, "./vitest.setup.ts")],
    testTimeout: 10000,
  },
});

