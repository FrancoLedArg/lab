// Drizzle
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { labPracticeFields } from "@/lib/db/schema/index";

export const fieldResults = pgTable("field_results", {
  id: serial("id").primaryKey(),
  labPracticeFieldId: integer("lab_practice_field_id").references(
    () => labPracticeFields.id,
    {
      onDelete: "restrict",
    },
  ),
  value: text("value").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const fieldResultsRelations = relations(fieldResults, ({ one }) => ({
  labPracticeField: one(labPracticeFields, {
    fields: [fieldResults.labPracticeFieldId],
    references: [labPracticeFields.id],
  }),
}));
