import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";

/**
 * Catálogo de prácticas bioquímicas
 * Define las prácticas disponibles en el sistema. Este catálogo puede ser
 * gestionado por GUI en el futuro, pero por ahora se usa directamente.
 */

export const labPractice = pgTable("lab_practice", {
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
