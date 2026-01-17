// Drizzle
import {
  pgTable,
  pgEnum,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Entities
import { patient } from "./core";
import { medicalOrder } from "./medical-orders";
import { result } from "./results";

export const reportStatusEnum = pgEnum("report_status", [
  "pending",
  "completed",
  "delivered",
]);

export const deliveryMethodEnum = pgEnum("delivery_method", [
  "physical",
  "digital",
]);

export const report = pgTable("report", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
  .references(() => patient.id, { onDelete: "cascade" })
  .notNull(),
  status: reportStatusEnum("status").notNull().default("pending"),
  deliveryDate: timestamp("delivery_date"),
  deliveryMethod: deliveryMethodEnum("deliver_method").notNull().default("physical"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const reportRelations = relations(report, ({ one, many }) => ({
  patient: one(patient, {
    fields: [report.patientId],
    references: [patient.id],
  }),
  medicalOrders: many(medicalOrder),
  results: many(result),
}));
