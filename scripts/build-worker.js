#!/usr/bin/env node

/**
 * Build script for Cloudflare Workers
 * Bundles the worker entry point with esbuild for optimal Workers compatibility
 */

import * as esbuild from "esbuild";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

async function build() {
  console.log("Building worker bundle...");

  try {
    await esbuild.build({
      entryPoints: [path.join(rootDir, "src/worker.ts")],
      bundle: true,
      outfile: path.join(rootDir, "dist/worker.js"),
      format: "esm",
      platform: "browser", // Workers use a browser-like environment
      target: "es2022",
      minify: process.env.NODE_ENV === "production",
      sourcemap: true,
      external: [
        // Prisma needs special handling - it's bundled separately
        "@prisma/client",
        "@prisma/adapter-d1",
      ],
      define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "production"),
      },
      conditions: ["worker", "browser"],
    });

    console.log("✅ Worker bundle built successfully: dist/worker.js");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();

