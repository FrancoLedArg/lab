import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * Paciente real - Persona a la que pertenecen las muestras y resultados clínicos.
 * Los resultados siempre deben estar a nombre del paciente real, independientemente
 * de quién figure como titular administrativo.
 */
export const patient = pgTable("patient", {
  id: integer("id").primaryKey(), // Documento Nacional de Identidad
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Prestador de salud / Obra social
 * Representa las diferentes obras sociales o prestadores que pueden autorizar prácticas.
 */
export const insuranceProvider = pgTable("insurance_provider", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code"), // Código interno o externo del prestador
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Titular administrativo
 * Persona cuyas credenciales de obra social se utilizan para autorizar prácticas.
 * Puede NO coincidir con el paciente real. Esta separación permite modelar casos
 * donde se usan credenciales de terceros (ej: hijo usa credenciales del padre).
 */
export const administrativeHolder = pgTable("administrative_holder", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  documentNumber: text("document_number").notNull(),
  insuranceProviderId: integer("insurance_provider_id")
    .references(() => insuranceProvider.id, { onDelete: "restrict" })
    .notNull(),
  membershipNumber: text("membership_number").notNull(), // Número de afiliado
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
