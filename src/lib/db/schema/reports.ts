// Drizzle
import {
  pgTable,
  pgEnum,
  timestamp,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { medicalRequests } from "@/lib/db/schema/index";

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
  medicalRequestId: integer("medical_request_id")
    .references(() => medicalRequests.id, { onDelete: "restrict" })
    .notNull(),
  status: reportStatusEnum("status").notNull().default("pending"),
  deliveryDate: timestamp("delivery_date"),
  deliveryMethod: deliveryMethodEnum("deliver_method")
    .notNull()
    .default("physical"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const reportRelations = relations(report, ({ one, many }) => ({
  medicalRequest: one(medicalRequests, {
    fields: [report.medicalRequestId],
    references: [medicalRequests.id],
  }),
}));
