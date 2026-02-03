import { pgTable, timestamp, integer, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import {
  healthcareAffiliates,
  healthcareProviders,
  requestItems,
} from "@/lib/db/schema/index";

/*
Que es la entidad "Medical Request"?

La representación administrativa y clínica de una indicación médica,
emitida en una fecha determinada, para un paciente concreto,
asociada a un afiliado de obra social (que puede o no coincidir con el paciente),
y que da origen a uno o más análisis a procesar por el laboratorio.
*/

export const medicalRequests = pgTable("medical_requests", {
  id: serial("id").primaryKey(),
  healthcareProviderId: integer("healthcare_provider_id")
    .references(() => healthcareProviders.id, { onDelete: "restrict" })
    .notNull(),
  healthcareAffiliateId: integer("healthcare_affiliate_id")
    .references(() => healthcareAffiliates.id, { onDelete: "restrict" })
    .notNull(),
  diagnosis: text("diagnosis").notNull(),
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
  ({ one, many }) => ({
    healthcareProvider: one(healthcareProviders, {
      fields: [medicalRequests.healthcareProviderId],
      references: [healthcareProviders.id],
    }),
    healthcareAffiliate: one(healthcareAffiliates, {
      fields: [medicalRequests.healthcareAffiliateId],
      references: [healthcareAffiliates.id],
    }),
    requestItems: many(requestItems),
  }),
);
