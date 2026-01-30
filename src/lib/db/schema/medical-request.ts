import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { patient, administrativeHolder } from "./core";
import { labPractice } from "@/lib/db/schema";

/**
 * Orden médica
 * Documento que indica las prácticas bioquímicas solicitadas por un profesional.
 * Una orden puede contener múltiples prácticas y ser autorizada total o parcialmente.
 **/

export const medicalRequest = pgTable("medical_request", {
  id: serial("id").primaryKey(),
  requestNumber: text("request_number").notNull().unique(), // Número de solicitud médica
  patientId: integer("patient_id")
    .references(() => patient.id, { onDelete: "restrict" })
    .notNull(),
  requestedAt: timestamp("requested_at")
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Prácticas incluidas en una orden médica
 * Tabla de relación many-to-many entre órdenes médicas y prácticas.
 * Permite que una orden contenga múltiples prácticas.
 */
export const orderPractice = pgTable("order_practice", {
  id: serial("id").primaryKey(),
  medicalOrderId: integer("medical_order_id")
    .references(() => medicalOrder.id, { onDelete: "cascade" })
    .notNull(),
  practiceId: integer("practice_id")
    .references(() => practice.id, { onDelete: "restrict" })
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
