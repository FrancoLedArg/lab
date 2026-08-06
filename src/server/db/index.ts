import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  return drizzle(neon(url), { schema });
}

type DbClient = ReturnType<typeof createDb>;

let instance: DbClient | undefined;

/**
 * Lazy so `auth:generate` can load the auth config without a live Neon URL.
 * First real query still requires DATABASE_URL.
 */
export const db = new Proxy({} as DbClient, {
  get(_target, prop, receiver) {
    if (!instance) {
      instance = createDb();
    }
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export type Db = DbClient;
