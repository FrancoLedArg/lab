import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { deliveryMethodEnum } from "./enums";
import { medicalOrder } from "./medical-orders";
import { patient } from "./core";
import { user } from "./auth";

/**
 * Entrega de resultados
 * Registra la entrega de un informe al paciente. Solo puede entregarse si todas
 * las prácticas asociadas tienen resultados ingresados y validados.
 * El informe siempre está a nombre del paciente real.
 */
export const resultDelivery = pgTable("result_delivery", {
  id: serial("id").primaryKey(),
  medicalOrderId: integer("medical_order_id")
    .references(() => medicalOrder.id, { onDelete: "restrict" })
    .notNull(),
  patientId: integer("patient_id")
    .references(() => patient.id, { onDelete: "restrict" })
    .notNull(), // SIEMPRE el paciente real
  deliveryMethod: deliveryMethodEnum("delivery_method").notNull(),
  deliveredBy: text("delivered_by").references(() => user.id, {
    onDelete: "set null",
  }), // Usuario que realizó la entrega
  deliveredAt: timestamp("delivered_at")
    .$defaultFn(() => new Date())
    .notNull(),
  notes: text("notes"), // Notas sobre la entrega
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
