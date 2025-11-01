import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db"; // your drizzle instance

// Plugins
import { openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  telemetry: { enabled: false },

  plugins: [openAPI(), nextCookies()],

  // Authentication Methods
  emailAndPassword: {
    enabled: true,
  },
});
