import { pgEnum } from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const authorizationStatusEnum = pgEnum("authorization_status", [
  "pending", // Pendiente de autorización
  "authorized", // Autorizada
  "partially_authorized", // Parcialmente autorizada
]);

export const resultStatusEnum = pgEnum("result_status", [
  "pending_validation", // Pendiente de validación
  "validated", // Validado
]);

export const deliveryMethodEnum = pgEnum("delivery_method", [
  "physical", // Entrega física (impresión)
  "digital", // Entrega digital (WhatsApp, etc.)
]);

export const processingLocationEnum = pgEnum("processing_location", [
  "internal", // Procesado internamente
  "external", // Derivado a laboratorio externo
]);

