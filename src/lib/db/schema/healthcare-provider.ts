import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const healthcareProviders = pgTable("healthcare_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
