import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { patients, requestItems } from "@/lib/db/schema/index";

/*
Que es la entidad "Medical Request"?

La representación administrativa y clínica de una indicación médica,
emitida en una fecha determinada, para un paciente concreto,
asociada a un afiliado de obra social (que puede o no coincidir con el paciente),
y que da origen a uno o más análisis a procesar por el laboratorio.
*/

export const medicalRequests = pgTable("medical_requests", {
  id: serial("id").primaryKey(),

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

export const medicalRequestRelations = relations(
  medicalRequests,
  ({ many }) => ({
    requestItems: many(requestItems),
  }),
);
