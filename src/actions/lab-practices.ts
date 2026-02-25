"use server";

import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Drizzle
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { labPractices, labPracticeFields } from "@/lib/db/schema/index";

// Validation Schemas
import { updateHierarchySchema } from "@/lib/validation/lab-practices";

export const createLabPractice = actionClient
  .metadata({ actionName: "createLabPractice" })
  .action(async () => {
    const newLabPractice = await db
      .insert(labPractices)
      .values({
        name: "Nueva práctica",
      })
      .returning();

    return newLabPractice;
  });

export const updateFieldsHierarchy = actionClient
  .metadata({ actionName: "updateFieldsHierarchy" })
  .inputSchema(updateHierarchySchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const { id, labPracticeFieldIds } = parsedInput;

    console.log("Server Action:", id, labPracticeFieldIds);

    const updateTransaction = db.transaction(async (tx) => {
      const existingLabPractice = await tx.query.labPractices.findFirst({
        where: eq(labPractices.id, id),
      });

      if (!existingLabPractice) {
        throw new Error("Práctica de laboratorio no encontrada.");
      }

      for (const [index, { id }] of labPracticeFieldIds.entries()) {
        const existingField = await tx.query.labPracticeFields.findFirst({
          where: eq(labPracticeFields.id, id),
        });

        if (!existingField) {
          throw new Error("Campo de práctica no encontrado.");
        }

        await tx
          .update(labPracticeFields)
          .set({
            hierarchy: index,
            updatedAt: new Date(),
          })
          .where(eq(labPracticeFields.id, id));
      }
    });

    return updateTransaction;
  });
