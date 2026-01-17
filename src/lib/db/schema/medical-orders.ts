import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { patient, administrativeHolder } from "./core";
import { practice } from "./practices";

/**
 * Orden médica
 * Documento que indica las prácticas bioquímicas solicitadas por un profesional.
 * Una orden puede contener múltiples prácticas y ser autorizada total o parcialmente.
 */
export const medicalOrder = pgTable("medical_order", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(), // Número de orden médica
  patientId: integer("patient_id")
    .references(() => patient.id, { onDelete: "restrict" })
    .notNull(), // Paciente real
  administrativeHolderId: integer("administrative_holder_id")
    .references(() => administrativeHolder.id, { onDelete: "restrict" })
    .notNull(), // Titular administrativo (puede ser diferente del paciente)
  doctorName: text("doctor_name"), // Nombre del profesional que emite la orden
  diagnosis: text("diagnosis"), // Diagnóstico (si aplica)
  orderDate: timestamp("order_date")
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
