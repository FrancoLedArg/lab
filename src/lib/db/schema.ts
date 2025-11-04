import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

// Patients
export const patient = pgTable("patient", {
  id: integer("id").primaryKey(), // National ID
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

export const patientRelation = relations(patient, ({ many }) => ({
  healthInsuranceNumbers: many(healthInsuranceNumber),
}));

// Health Insurance Providers
export const healthInsuranceProvider = pgTable("health_insurance_provider", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const healthInsuranceProviderRelation = relations(
  healthInsuranceProvider,
  ({ many }) => ({
    healthInsuranceNumbers: many(healthInsuranceNumber),
  })
);

// Health Insurance Numbers
export const healthInsuranceNumber = pgTable("health_insurance_number", {
  id: integer("id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patient.id, { onDelete: "cascade" }),
  healthInsuranceProviderId: integer("health_insurance_provider_id")
    .notNull()
    .references(() => healthInsuranceProvider.id, { onDelete: "cascade" }),
  number: text("number").notNull(),
});

export const healthInsuranceNumberRelation = relations(
  healthInsuranceNumber,
  ({ one }) => ({
    patient: one(patient, {
      fields: [healthInsuranceNumber.patientId],
      references: [patient.id],
    }),
    healthInsuranceProvider: one(healthInsuranceProvider, {
      fields: [healthInsuranceNumber.healthInsuranceProviderId],
      references: [healthInsuranceProvider.id],
    }),
  })
);

/*

// Lab Practices
export const labPractice = pgTable("lab_practice", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  method: text("method").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const labPracticeRelation = relations(labPractice, ({ many }) => ({
  fields: many(labPracticeField),
}));

// Lab Practice Fields
export const labPracticeField = pgTable("lab_practice_field", {
  id: text("id").primaryKey(),
  labPracticeId: text("lab_practice_id")
    .notNull()
    .references(() => labPractice.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  messuringUnit: text("messuring_unit").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const labPracticeFieldRelation = relations(
  labPracticeField,
  ({ one }) => ({
    labPractice: one(labPractice, {
      fields: [labPracticeField.labPracticeId],
      references: [labPractice.id],
    }),
  })
);

// Reference Values
export const referenceValue = pgTable("reference_value", {
  id: text("id").primaryKey(),
  labPracticeFieldId: text("lab_practice_field_id")
    .notNull()
    .references(() => labPracticeField.id, { onDelete: "cascade" }),
  value: text("value").notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

*/
