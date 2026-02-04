// Drizzle
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { labPractice, fieldResults } from "@/lib/db/schema/index";

export const dataTypeEnum = pgEnum("data_type", [
  "TEXT",
  "NUMBER",
  "BOOLEAN",
  "CALCULATED",
]);

export const labPracticeFields = pgTable("lab_practice_fields", {
  id: serial("id").primaryKey(),
  labPracticeId: integer("lab_practice_id").references(() => labPractice.id, {
    onDelete: "restrict",
  }),
  name: text("name").notNull(),
  dataType: dataTypeEnum("data_type").notNull(),
  unit: text("unit").notNull(),
  minRange: decimal("min_range").notNull(),
  maxRange: decimal("max_range").notNull(),
  hierarchy: integer("hierarchy").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const labPracticeFieldsRelations = relations(
  labPracticeFields,
  ({ one }) => ({
    labPractice: one(labPractice, {
      fields: [labPracticeFields.labPracticeId],
      references: [labPractice.id],
    }),
    fieldResults: one(fieldResults, {
      fields: [labPracticeFields.id],
      references: [fieldResults.labPracticeFieldId],
    }),
  }),
);
