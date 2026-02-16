// Drizzle
import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { labPracticeFields, requestItems } from "@/lib/db/schema/index";

/**
 * Catálogo de prácticas bioquímicas
 * Define las prácticas disponibles en el sistema. Este catálogo puede ser
 * gestionado por GUI en el futuro, pero por ahora se usa directamente.
 */

export const labPracticeStatusEnum = pgEnum("lab_practice_status", [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
]);

export const labPractices = pgTable("lab_practices", {
  id: serial("id").primaryKey(),
  code: integer("code").unique(),
  name: text("name").notNull(),
  status: labPracticeStatusEnum("lab_practice_status")
    .notNull()
    .default("DRAFT"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const labPracticeRelations = relations(labPractices, ({ many }) => ({
  labPracticeFields: many(labPracticeFields),
  requestItems: many(requestItems),
}));
