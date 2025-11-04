import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { SQL, desc, asc } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

// Schema
import * as schema from "./schema";

// Env
import { env } from "@/config/env";

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql, schema });

// Helper function to provide findMany-like API for cleaner query syntax
export async function findMany<TTable extends PgTable>(
  table: TTable,
  options?: {
    orderBy?: Array<{
      column: keyof TTable;
      direction?: "asc" | "desc";
    }>;
    where?: SQL;
    limit?: number;
    offset?: number;
  }
) {
  let query = db.select().from(table);

  if (options?.orderBy && options.orderBy.length > 0) {
    const orderByClauses = options.orderBy.map((order) => {
      const column = table[order.column] as any;
      return order.direction === "desc" ? desc(column) : asc(column);
    });
    query = query.orderBy(...orderByClauses) as typeof query;
  }

  if (options?.where) {
    query = query.where(options.where) as typeof query;
  }

  if (options?.limit !== undefined) {
    query = query.limit(options.limit) as typeof query;
  }

  if (options?.offset !== undefined) {
    query = query.offset(options.offset) as typeof query;
  }

  return query;
}
