import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      DATABASE_URL:
        "postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder",
      BETTER_AUTH_SECRET: "abcdefghijklmnopqrstuvwxyz123456",
      BETTER_AUTH_URL: "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
    },
  },
});
