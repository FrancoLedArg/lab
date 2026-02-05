// Drizzle
import {
  pgTable,
  integer,
  serial,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Schemas
import { healthcareAffiliates } from "./healthcare-affiliates";

/*
La entidad "Healthcare Provider" representa a una obra social u organismo
que actúa como proveedor de cobertura médica para los pacientes del laboratorio.

Esta entidad centraliza la información operativa, administrativa y económica
necesaria para procesar pedidos médicos, autorizar prácticas bioquímicas
y gestionar la facturación asociada.

Un Healthcare Provider define:
- El estado operativo de la obra social frente al laboratorio (habilitada, suspendida,
  en mora o de bajo valor de UB).
- El valor de la Unidad Bioquímica (UB), que impacta directamente en la facturación.
- Las instrucciones administrativas y operativas para la gestión de autorizaciones
  y copagos, expresadas en lenguaje humano.

El campo "status" no es meramente informativo, sino que representa una regla de negocio
con impacto directo en la operatoria del laboratorio. En particular, los proveedores
marcados con estado "LOW_UB_VALUE" requieren el cobro de un copago obligatorio fijo
al afiliado, definido como política general del laboratorio.

Las reglas de autorización y copago que presentan alta variabilidad entre proveedores
no se modelan como lógica estructurada, sino como instrucciones textuales, con el objetivo
de reflejar fielmente la realidad operativa y permitir tanto la gestión humana actual
como una futura interpretación automatizada.

Esta entidad es referenciada por afiliados, pedidos médicos y procesos administrativos,
actuando como una fuente única de verdad para las reglas asociadas a cada obra social.
*/

export const providerStatusEnum = pgEnum("provider_status", [
  "ENABLED",
  "SUSPENDED",
  "IN_ARREARS",
  "LOW_UB_VALUE",
]);

export const healthcareProviders = pgTable("healthcare_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  alias: text("alias").notNull(),
  code: integer("code").notNull().unique(),
  providerStatus: providerStatusEnum("provider_status")
    .notNull()
    .default("ENABLED"),
  ubValue: integer("ub_value").notNull(),
  authorizationInstructions: text("authorization_instructions"),
  copaymentInstructions: text("copayment_instructions"),
  operationalNotes: text("operational_notes"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const healthcareProviderRelations = relations(
  healthcareProviders,
  ({ many }) => ({
    healthcareAffiliates: many(healthcareAffiliates),
  }),
);
