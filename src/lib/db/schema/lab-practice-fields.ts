// Drizzle
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import {
  labPractices,
  fieldResults,
  referenceValues,
} from "@/lib/db/schema/index";

export const dataTypeEnum = pgEnum("data_type", [
  "TEXT",
  "NUMBER",
  "BOOLEAN",
  "CALCULATED",
]);

export const labPracticeFields = pgTable("lab_practice_fields", {
  id: serial("id").primaryKey(),
  labPracticeId: integer("lab_practice_id")
    .references(() => labPractices.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  dataType: dataTypeEnum("data_type").notNull().default("TEXT"),
  unit: text("unit").notNull(),
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
  ({ one, many }) => ({
    labPractice: one(labPractices, {
      fields: [labPracticeFields.labPracticeId],
      references: [labPractices.id],
    }),
    fieldResults: one(fieldResults, {
      fields: [labPracticeFields.id],
      references: [fieldResults.labPracticeFieldId],
    }),
    referenceValues: many(referenceValues),
  }),
);
