// Drizzle
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Schemas
import { requestItems } from "@/lib/db/schema/index";

export const result = pgTable("result", {
  id: serial("id").primaryKey(),
  requestItemId: integer("request_item_id")
    .references(() => requestItems.medicalRequestId, { onDelete: "restrict" })
    .notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
