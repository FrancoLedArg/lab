// Drizzle
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { healthcareProviders } from "@/lib/db/schema/index";

/*
La entidad "Healthcare Affiliate" representa la afiliación de una persona
a un proveedor de servicios de salud (obra social o prepaga).

Modela la relación administrativa entre una persona y una cobertura de salud,
incluyendo información propia de dicha afiliación como el número de afiliado y
el plan contratado, independientemente de los pedidos médicos
o de los análisis que se realicen bajo esa cobertura.

Esta entidad no representa al paciente ni al afiliado como persona,
sino a la afiliación en sí misma, permitiendo que una misma persona pueda
poseer múltiples afiliaciones a lo largo del tiempo o de forma simultánea.

Su propósito principal es:
- Centralizar la información de cobertura de salud asociada a una persona
- Permitir la reutilización de una misma afiliación en múltiples pedidos médicos
- Facilitar la trazabilidad histórica del uso de una afiliación
- Detectar situaciones administrativas relevantes, como el uso recurrente
  de una misma afiliación en distintos pacientes o en períodos cortos de tiempo
- Servir como base para los procesos de autorización y facturación,
  sin modelar reglas específicas de cada proveedor
*/

export const healthcareAffiliates = pgTable("healthcare_affiliates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  healthcareProviderId: integer("healthcare_provider_id")
    .references(() => healthcareProviders.id, { onDelete: "restrict" })
    .notNull(),
  affiliateNumber: text("affiliate_number").notNull(),
  affiliatePlan: text("affiliate_plan").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const healthcareAffiliatesRelations = relations(
  healthcareAffiliates,
  ({ one }) => ({
    healthcareProvider: one(healthcareProviders, {
      fields: [healthcareAffiliates.healthcareProviderId],
      references: [healthcareProviders.id],
    }),
  }),
);
