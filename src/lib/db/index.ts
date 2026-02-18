import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Schema
import * as schema from "./schema/index";

// Env
import { env } from "@/config/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: true,
});
export const db = drizzle({ client: pool, schema });
