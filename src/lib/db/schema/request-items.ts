import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { medicalRequests, labPractices } from "@/lib/db/schema/index";

/*
La entidad "Request Item" es una entidad intermedia con identidad propia.

Representa un análisis solicitado por un médico dentro de un pedido médico,
y existe para modelar cada solicitud individual como una unidad de negocio
independiente, aun cuando la práctica bioquímica correspondiente no se
encuentre definida, normalizada o identificable de forma inmediata en el sistema.

Esta entidad permite registrar solicitudes en las que:
- la práctica bioquímica aún no existe o no está parametrizada en el sistema
- la información disponible no es suficiente para establecer una correspondencia
  directa e inequívoca con una práctica bioquímica formal
- la solicitud requiere validación o aclaración adicional antes de poder ser normalizada

Request Item actúa como nexo conceptual y operativo entre:
- el pedido médico
- la práctica bioquímica

A diferencia de una tabla de relación tradicional, posee identidad y ciclo de vida propios,
ya que el acto de solicitar un análisis constituye un evento relevante para el negocio
y para la trazabilidad operativa del laboratorio.

Su propósito principal es:
- Permitir la carga de pedidos médicos sin bloquear la operación
- Modelar explícitamente el estado de normalización de cada análisis solicitado
- Centralizar el estado de autorización de la solicitud de forma independiente
- Permitir la normalización progresiva de la información hacia prácticas bioquímicas formales,
  habilitando su posterior autorización y ejecución cuando corresponda
*/

export const normalizationStatusEnum = pgEnum("normalization_status", [
  "NORMALIZED",
  "MISSING_SYSTEM_DEFINITION",
  "AMBIGUOUS_REQUEST",
  "REQUIRES_EXTERNAL_REVIEW",
  "DISCARDED",
]);

export const authorizationStatusEnum = pgEnum("authorization_status", [
  "PENDING",
  "AUTHORIZED",
  "REJECTED",
]);

export const requestItems = pgTable(
  "request_items",
  {
    medicalRequestId: integer("medical_request_id")
      .references(() => medicalRequests.id, { onDelete: "restrict" })
      .notNull(),
    labPracticeId: integer("lab_practice_id")
      .references(() => labPractices.id, {
        onDelete: "restrict",
      })
      .notNull(),
    normalizationStatus: normalizationStatusEnum(
      "normalization_status",
    ).notNull(),
    normalizationDescription: text("issue_description"),
    authorizationStatus: authorizationStatusEnum(
      "authorization_status",
    ).notNull(),
    authorizationDescription: text("authorization_description"),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at")
      .$defaultFn(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.medicalRequestId, table.labPracticeId] }),
  ],
);
