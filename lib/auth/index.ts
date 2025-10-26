import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db"; // your drizzle instance

// Open Api
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  telemetry: { enabled: false },
  plugins: [openAPI()],

  // Authentication Methods
  emailAndPassword: {
    enabled: true,
  },
});
