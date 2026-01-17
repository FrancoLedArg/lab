import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { authorizationStatusEnum } from "./enums";
import { medicalOrder } from "./medical-orders";
import { orderPractice } from "./medical-orders";

/**
 * Autorización
 * Comprobante que habilita el cobro de una o más prácticas. El formato puede variar:
 * - Número de autorización
 * - Cupón firmado
 * - Comprobante digital
 *
 * Sin autorización válida, una práctica NO es facturable (invariante del dominio).
 */
export const authorization = pgTable("authorization", {
  id: serial("id").primaryKey(),
  authorizationNumber: text("authorization_number"), // Número de autorización (si aplica)
  authorizationDocument: text("authorization_document"), // Referencia a documento/cupón
  status: authorizationStatusEnum("status").notNull().default("pending"),
  medicalOrderId: integer("medical_order_id")
    .references(() => medicalOrder.id, { onDelete: "restrict" })
    .notNull(),
  authorizedAt: timestamp("authorized_at"), // Fecha de autorización
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Prácticas autorizadas
 * Relaciona una autorización con las prácticas específicas que fueron autorizadas.
 * Permite autorizaciones parciales: no todas las prácticas de una orden deben estar autorizadas.
 */
export const authorizedPractice = pgTable("authorized_practice", {
  id: serial("id").primaryKey(),
  authorizationId: integer("authorization_id")
    .references(() => authorization.id, { onDelete: "cascade" })
    .notNull(),
  orderPracticeId: integer("order_practice_id")
    .references(() => orderPractice.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Copago
 * Monto que el paciente debe abonar, determinado por el prestador y las prácticas autorizadas.
 */
export const copayment = pgTable("copayment", {
  id: serial("id").primaryKey(),
  authorizationId: integer("authorization_id")
    .references(() => authorization.id, { onDelete: "restrict" })
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paid: boolean("paid").notNull().default(false),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
