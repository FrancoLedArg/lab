import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { processingLocationEnum } from "./enums";
import { orderPractice } from "./medical-orders";

/**
 * Laboratorio externo
 * Representa los laboratorios externos a los que se pueden derivar muestras.
 */
export const externalLab = pgTable("external_lab", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code"), // Código interno del laboratorio
  contactInfo: text("contact_info"), // Información de contacto
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Muestra
 * Representa una muestra biológica que puede ser procesada internamente o derivada.
 * Debe ser completamente trazable: se debe conocer dónde se procesó y bajo qué identificador.
 */
export const sample = pgTable("sample", {
  id: serial("id").primaryKey(),
  sampleNumber: text("sample_number").notNull().unique(), // Número de muestra interno
  orderPracticeId: integer("order_practice_id")
    .references(() => orderPractice.id, { onDelete: "restrict" })
    .notNull(),
  processingLocation: processingLocationEnum("processing_location")
    .notNull()
    .default("internal"),
  externalLabId: integer("external_lab_id").references(() => externalLab.id, {
    onDelete: "set null",
  }), // Solo si processingLocation = 'external'
  externalSampleId: text("external_sample_id"), // Identificador externo (ej: "AJM0000250")
  collectedAt: timestamp("collected_at"), // Fecha de recolección
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Derivación
 * Registra el proceso de envío de una muestra a un laboratorio externo.
 * Proporciona trazabilidad adicional sobre cuándo y cómo se derivó la muestra.
 */
export const derivation = pgTable("derivation", {
  id: serial("id").primaryKey(),
  sampleId: integer("sample_id")
    .references(() => sample.id, { onDelete: "restrict" })
    .notNull(),
  externalLabId: integer("external_lab_id")
    .references(() => externalLab.id, { onDelete: "restrict" })
    .notNull(),
  externalSampleId: text("external_sample_id").notNull(), // ID asignado por el lab externo
  derivedAt: timestamp("derived_at")
    .$defaultFn(() => new Date())
    .notNull(),
  notes: text("notes"), // Notas adicionales sobre la derivación
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
