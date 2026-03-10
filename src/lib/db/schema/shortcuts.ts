// Drizzle
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { labPracticeFields } from "@/lib/db/schema/index";

export const shortcuts = pgTable("shortcuts", {
  id: serial("id").primaryKey(),
  labPracticeFieldId: integer("lab_practice_field_id")
    .references(() => labPracticeFields.id, {
      onDelete: "cascade",
    })
    .notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const shortcutsRelations = relations(shortcuts, ({ one }) => ({
  labPracticeField: one(labPracticeFields, {
    fields: [shortcuts.labPracticeFieldId],
    references: [labPracticeFields.id],
  }),
}));

