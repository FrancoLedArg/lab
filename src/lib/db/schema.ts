import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Better Auth Schemas - DON'T TOUCH

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

// End Better Auth Schemas - DON'T TOUCH

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

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * Paciente real - Persona a la que pertenecen las muestras y resultados clínicos.
 * Los resultados siempre deben estar a nombre del paciente real, independientemente
 * de quién figure como titular administrativo.
 */
export const patient = pgTable("patient", {
  id: integer("id").primaryKey(), // Documento Nacional de Identidad
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Prestador de salud / Obra social
 * Representa las diferentes obras sociales o prestadores que pueden autorizar prácticas.
 */
export const insuranceProvider = pgTable("insurance_provider", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code"), // Código interno o externo del prestador
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Titular administrativo
 * Persona cuyas credenciales de obra social se utilizan para autorizar prácticas.
 * Puede NO coincidir con el paciente real. Esta separación permite modelar casos
 * donde se usan credenciales de terceros (ej: hijo usa credenciales del padre).
 */
export const administrativeHolder = pgTable("administrative_holder", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  documentNumber: text("document_number").notNull(),
  insuranceProviderId: integer("insurance_provider_id")
    .references(() => insuranceProvider.id, { onDelete: "restrict" })
    .notNull(),
  membershipNumber: text("membership_number").notNull(), // Número de afiliado
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Catálogo de prácticas bioquímicas
 * Define las prácticas disponibles en el sistema. Este catálogo puede ser
 * gestionado por GUI en el futuro, pero por ahora se usa directamente.
 */
export const practice = pgTable("practice", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // Código de la práctica
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Orden médica
 * Documento que indica las prácticas bioquímicas solicitadas por un profesional.
 * Una orden puede contener múltiples prácticas y ser autorizada total o parcialmente.
 */
export const medicalOrder = pgTable("medical_order", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(), // Número de orden médica
  patientId: integer("patient_id")
    .references(() => patient.id, { onDelete: "restrict" })
    .notNull(), // Paciente real
  administrativeHolderId: integer("administrative_holder_id")
    .references(() => administrativeHolder.id, { onDelete: "restrict" })
    .notNull(), // Titular administrativo (puede ser diferente del paciente)
  doctorName: text("doctor_name"), // Nombre del profesional que emite la orden
  orderDate: timestamp("order_date")
    .$defaultFn(() => new Date())
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Prácticas incluidas en una orden médica
 * Tabla de relación many-to-many entre órdenes médicas y prácticas.
 * Permite que una orden contenga múltiples prácticas.
 */
export const orderPractice = pgTable("order_practice", {
  id: serial("id").primaryKey(),
  medicalOrderId: integer("medical_order_id")
    .references(() => medicalOrder.id, { onDelete: "cascade" })
    .notNull(),
  practiceId: integer("practice_id")
    .references(() => practice.id, { onDelete: "restrict" })
    .notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

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

/**
 * Laboratorio externo
 * Representa los laboratorios externos a los que se pueden derivar muestras.
 */
export const externalLab = pgTable("external_lab", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code"), // Código interno del laboratorio
  contactInfo: text("contact_info"), // Información de contacto
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Muestra
 * Representa una muestra biológica que puede ser procesada internamente o derivada.
 * Debe ser completamente trazable: se debe conocer dónde se procesó y bajo qué identificador.
 */
export const sample = pgTable("sample", {
  id: serial("id").primaryKey(),
  sampleNumber: text("sample_number").notNull().unique(), // Número de muestra interno
  orderPracticeId: integer("order_practice_id")
    .references(() => orderPractice.id, { onDelete: "restrict" })
    .notNull(),
  processingLocation: processingLocationEnum("processing_location")
    .notNull()
    .default("internal"),
  externalLabId: integer("external_lab_id").references(
    () => externalLab.id,
    { onDelete: "set null" }
  ), // Solo si processingLocation = 'external'
  externalSampleId: text("external_sample_id"), // Identificador externo (ej: "AJM0000250")
  collectedAt: timestamp("collected_at"), // Fecha de recolección
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Derivación
 * Registra el proceso de envío de una muestra a un laboratorio externo.
 * Proporciona trazabilidad adicional sobre cuándo y cómo se derivó la muestra.
 */
export const derivation = pgTable("derivation", {
  id: serial("id").primaryKey(),
  sampleId: integer("sample_id")
    .references(() => sample.id, { onDelete: "restrict" })
    .notNull(),
  externalLabId: integer("external_lab_id")
    .references(() => externalLab.id, { onDelete: "restrict" })
    .notNull(),
  externalSampleId: text("external_sample_id").notNull(), // ID asignado por el lab externo
  derivedAt: timestamp("derived_at")
    .$defaultFn(() => new Date())
    .notNull(),
  notes: text("notes"), // Notas adicionales sobre la derivación
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Resultado
 * Valores obtenidos a partir del procesamiento de muestras (internas o derivadas).
 * Debe estar asociado al paciente real, no al titular administrativo.
 * Requiere trazabilidad: quién ingresó y cuándo.
 */
export const result = pgTable("result", {
  id: serial("id").primaryKey(),
  sampleId: integer("sample_id")
    .references(() => sample.id, { onDelete: "restrict" })
    .notNull(),
  patientId: integer("patient_id")
    .references(() => patient.id, { onDelete: "restrict" })
    .notNull(), // SIEMPRE el paciente real, nunca el titular administrativo
  enteredBy: text("entered_by")
    .references(() => user.id, { onDelete: "set null" })
    .notNull(), // Usuario que ingresó el resultado
  enteredAt: timestamp("entered_at")
    .$defaultFn(() => new Date())
    .notNull(),
  status: resultStatusEnum("status").notNull().default("pending_validation"),
  values: text("values").notNull(), // JSON con los valores del resultado
  notes: text("notes"), // Notas adicionales
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Validación de resultado
 * Registra la validación explícita de un resultado por la bioquímica.
 * La validación es una acción diferenciada del ingreso y habilita la entrega.
 */
export const resultValidation = pgTable("result_validation", {
  id: serial("id").primaryKey(),
  resultId: integer("result_id")
    .references(() => result.id, { onDelete: "cascade" })
    .notNull()
    .unique(), // Un resultado solo puede ser validado una vez
  validatedBy: text("validated_by")
    .references(() => user.id, { onDelete: "set null" })
    .notNull(), // Bioquímica que valida
  validatedAt: timestamp("validated_at")
    .$defaultFn(() => new Date())
    .notNull(),
  notes: text("notes"), // Notas de validación
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

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

// ============================================================================
// RELATIONS
// ============================================================================

export const patientRelations = relations(patient, ({ many }) => ({
  medicalOrders: many(medicalOrder),
  results: many(result),
  resultDeliveries: many(resultDelivery),
}));

export const insuranceProviderRelations = relations(
  insuranceProvider,
  ({ many }) => ({
    administrativeHolders: many(administrativeHolder),
  })
);

export const administrativeHolderRelations = relations(
  administrativeHolder,
  ({ one, many }) => ({
    insuranceProvider: one(insuranceProvider, {
      fields: [administrativeHolder.insuranceProviderId],
      references: [insuranceProvider.id],
    }),
    medicalOrders: many(medicalOrder),
  })
);

export const practiceRelations = relations(practice, ({ many }) => ({
  orderPractices: many(orderPractice),
}));

export const medicalOrderRelations = relations(medicalOrder, ({ one, many }) => ({
  patient: one(patient, {
    fields: [medicalOrder.patientId],
    references: [patient.id],
  }),
  administrativeHolder: one(administrativeHolder, {
    fields: [medicalOrder.administrativeHolderId],
    references: [administrativeHolder.id],
  }),
  orderPractices: many(orderPractice),
  authorizations: many(authorization),
  resultDeliveries: many(resultDelivery),
}));

export const orderPracticeRelations = relations(orderPractice, ({ one, many }) => ({
  medicalOrder: one(medicalOrder, {
    fields: [orderPractice.medicalOrderId],
    references: [medicalOrder.id],
  }),
  practice: one(practice, {
    fields: [orderPractice.practiceId],
    references: [practice.id],
  }),
  authorizedPractices: many(authorizedPractice),
  samples: many(sample),
}));

export const authorizationRelations = relations(authorization, ({ one, many }) => ({
  medicalOrder: one(medicalOrder, {
    fields: [authorization.medicalOrderId],
    references: [medicalOrder.id],
  }),
  authorizedPractices: many(authorizedPractice),
  copayment: one(copayment, {
    fields: [authorization.id],
    references: [copayment.authorizationId],
  }),
}));

export const authorizedPracticeRelations = relations(
  authorizedPractice,
  ({ one }) => ({
    authorization: one(authorization, {
      fields: [authorizedPractice.authorizationId],
      references: [authorization.id],
    }),
    orderPractice: one(orderPractice, {
      fields: [authorizedPractice.orderPracticeId],
      references: [orderPractice.id],
    }),
  })
);

export const copaymentRelations = relations(copayment, ({ one }) => ({
  authorization: one(authorization, {
    fields: [copayment.authorizationId],
    references: [authorization.id],
  }),
}));

export const externalLabRelations = relations(externalLab, ({ many }) => ({
  samples: many(sample),
  derivations: many(derivation),
}));

export const sampleRelations = relations(sample, ({ one, many }) => ({
  orderPractice: one(orderPractice, {
    fields: [sample.orderPracticeId],
    references: [orderPractice.id],
  }),
  externalLab: one(externalLab, {
    fields: [sample.externalLabId],
    references: [externalLab.id],
  }),
  derivations: many(derivation),
  results: many(result),
}));

export const derivationRelations = relations(derivation, ({ one }) => ({
  sample: one(sample, {
    fields: [derivation.sampleId],
    references: [sample.id],
  }),
  externalLab: one(externalLab, {
    fields: [derivation.externalLabId],
    references: [externalLab.id],
  }),
}));

export const resultRelations = relations(result, ({ one }) => ({
  sample: one(sample, {
    fields: [result.sampleId],
    references: [sample.id],
  }),
  patient: one(patient, {
    fields: [result.patientId],
    references: [patient.id],
  }),
  enteredByUser: one(user, {
    fields: [result.enteredBy],
    references: [user.id],
  }),
  validation: one(resultValidation, {
    fields: [result.id],
    references: [resultValidation.resultId],
  }),
}));

export const resultValidationRelations = relations(resultValidation, ({ one }) => ({
  result: one(result, {
    fields: [resultValidation.resultId],
    references: [result.id],
  }),
  validatedByUser: one(user, {
    fields: [resultValidation.validatedBy],
    references: [user.id],
  }),
}));

export const resultDeliveryRelations = relations(resultDelivery, ({ one }) => ({
  medicalOrder: one(medicalOrder, {
    fields: [resultDelivery.medicalOrderId],
    references: [medicalOrder.id],
  }),
  patient: one(patient, {
    fields: [resultDelivery.patientId],
    references: [patient.id],
  }),
  deliveredByUser: one(user, {
    fields: [resultDelivery.deliveredBy],
    references: [user.id],
  }),
}));

