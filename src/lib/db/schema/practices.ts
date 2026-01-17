import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  decimal,
} from "drizzle-orm/pg-core";

/**
 * Catálogo de prácticas bioquímicas
 * Define las prácticas disponibles en el sistema. Este catálogo puede ser
 * gestionado por GUI en el futuro, pero por ahora se usa directamente.
 */
export const practice = pgTable("practice", {
  id: serial("id").primaryKey(),
  code: integer("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const parameter = pgTable("parameter", {
  id: integer("id").primaryKey(),
  practiceId: integer("practice_id")
    .references(() => practice.id, { onDelete: "restrict" })
    .notNull(),
  name: text("name").notNull(),
  unit: text("unit").notNull(),
  minimumRange: decimal("minimum_range", { precision: 10, scale: 2 }).notNull(),
  maximumRange: decimal("maximum_range", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
