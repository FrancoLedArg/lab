import { relations } from "drizzle-orm";
import { patient, insuranceProvider, administrativeHolder } from "./core";
import { practice } from "./practices";
import { report } from "./reports";
import { medicalOrder, orderPractice } from "./medical-orders";
import { authorization, authorizedPractice, copayment } from "./authorizations";
import { externalLab, sample, derivation } from "./samples";
import { result, resultValidation } from "./results";
import { resultDelivery } from "./deliveries";
import { user } from "./auth";

// ============================================================================
// RELATIONS
// ============================================================================

export const patientRelations = relations(patient, ({ many }) => ({
  medicalOrders: many(medicalOrder),
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

export const reportRelations = relations(report, ({ one, many }) => ({
  patient: one(patient, {
    fields: [report.patientId],
    references: [patient.id],
  }),
  medicalOrders: many(medicalOrder),
}));

export const medicalOrderRelations = relations(
  medicalOrder,
  ({ one, many }) => ({
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
  })
);

export const orderPracticeRelations = relations(
  orderPractice,
  ({ one, many }) => ({
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
  })
);

export const authorizationRelations = relations(
  authorization,
  ({ one, many }) => ({
    medicalOrder: one(medicalOrder, {
      fields: [authorization.medicalOrderId],
      references: [medicalOrder.id],
    }),
    authorizedPractices: many(authorizedPractice),
    copayment: one(copayment, {
      fields: [authorization.id],
      references: [copayment.authorizationId],
    }),
  })
);

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
  validation: one(resultValidation, {
    fields: [result.id],
    references: [resultValidation.resultId],
  }),
}));

export const resultValidationRelations = relations(
  resultValidation,
  ({ one }) => ({
    result: one(result, {
      fields: [resultValidation.resultId],
      references: [result.id],
    }),
    validatedByUser: one(user, {
      fields: [resultValidation.validatedBy],
      references: [user.id],
    }),
  })
);

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
