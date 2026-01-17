import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const result = pgTable("result", {
  id: integer("id").primaryKey(),
  value: text("value").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Validación de resultado
 * Registra la validación explícita de un resultado por la bioquímica.
 * La validación es una acción diferenciada del ingreso y habilita la entrega.
 */
export const resultValidation = pgTable("result_validation", {
  id: serial("id").primaryKey(),
  resultId: integer("result_id")
    .references(() => result.id, { onDelete: "cascade" })
    .notNull()
    .unique(), // Un resultado solo puede ser validado una vez
  validatedBy: text("validated_by")
    .references(() => user.id, { onDelete: "set null" })
    .notNull(), // Bioquímica que valida
  validatedAt: timestamp("validated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  notes: text("notes"), // Notas de validación
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
