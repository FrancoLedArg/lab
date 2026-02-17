"use server";

import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Drizzle
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { labPracticeFields } from "@/lib/db/schema/index";

// Validation Schemas
import {
  createLabPracticeFieldSchema as createSchema,
  updateLabPracticeFieldSchema as updateSchema,
  deleteLabPracticeFieldSchema as deleteSchema,
} from "@/lib/validation/lab-practice-fields";

export const createLabPracticeField = actionClient
  .metadata({ actionName: "createLabPracticeField" })
  .inputSchema(createSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const { labPracticeId, hierarchy } = parsedInput;

    const newLabPracticeField = await db
      .insert(labPracticeFields)
      .values({
        labPracticeId: Number(labPracticeId),
        name: "Nuevo Campo",
        dataType: "TEXT",
        unit: "Unidad",
        hierarchy,
      })
      .returning();

    return newLabPracticeField;
  });

export const updateLabPracticeField = actionClient
  .metadata({ actionName: "updateLabPracticeField" })
  .inputSchema(updateSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const updateTransaction = db.transaction(async (tx) => {
      const existingPracticeField = await tx.query.labPracticeFields.findFirst({
        where: eq(labPracticeFields.id, parsedInput.id),
      });

      if (!existingPracticeField) {
        throw new Error("Campo de práctica no encontrado.");
      }

      const [updatedPracticeField] = await tx
        .update(labPracticeFields)
        .set({
          ...parsedInput,
          updatedAt: new Date(),
        })
        .where(eq(labPracticeFields.id, parsedInput.id))
        .returning();

      return updatedPracticeField;
    });

    return updateTransaction;
  });

export const deleteLabPracticeField = actionClient
  .metadata({ actionName: "deleteLabPracticeField" })
  .inputSchema(deleteSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;

    const deletedLabPracticeField = await db
      .delete(labPracticeFields)
      .where(eq(labPracticeFields.id, id))
      .returning();

    return deletedLabPracticeField;
  });
