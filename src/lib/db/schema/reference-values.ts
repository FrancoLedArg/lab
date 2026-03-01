// Drizzle
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { labPracticeFields } from "@/lib/db/schema/index";

export const referenceValues = pgTable("reference_values", {
  id: serial("id").primaryKey(),
  labPracticeFieldId: integer("lab_practice_field_id")
    .references(() => labPracticeFields.id, {
      onDelete: "cascade",
    })
    .notNull(),
  name: text("name").notNull(),
  minRange: integer("min_range").notNull(),
  maxRange: integer("max_range").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const referenceValuesRelations = relations(
  referenceValues,
  ({ one }) => ({
    labPracticeField: one(labPracticeFields, {
      fields: [referenceValues.labPracticeFieldId],
      references: [labPracticeFields.id],
    }),
  }),
);
