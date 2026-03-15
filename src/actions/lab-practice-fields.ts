"use server";

import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Drizzle
import { db } from "@/lib/db";
import { eq, and, notInArray } from "drizzle-orm";
import {
  labPracticeFields,
  referenceValues,
  shortcuts,
} from "@/lib/db/schema/index";

// Validation Schemas
import {
  selectSchema,
  insertSchema,
  updateSchema,
} from "@/lib/validation/lab-practice-fields";

export const createLabPracticeField = actionClient
  .metadata({ actionName: "createLabPracticeField" })
  .inputSchema(insertSchema, {
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
    const { labPracticeId, name, dataType, unit } = parsedInput;

    const updateTransaction = db.transaction(async (tx) => {
      const existingPracticeField = await tx.query.labPracticeFields.findFirst({
        with: {
          referenceValues: true,
          shortcuts: true,
        },
        where: eq(labPracticeFields.id, parsedInput.id),
      });

      if (!existingPracticeField) {
        throw new Error("Campo de práctica no encontrado.");
      }

      await tx
        .update(labPracticeFields)
        .set({
          labPracticeId,
          name,
          dataType,
          unit,
          updatedAt: new Date(),
        })
        .where(eq(labPracticeFields.id, parsedInput.id));

      // Reference Values
      const previousReferenceValues = existingPracticeField.referenceValues.map(
        (item) => item.id,
      );
      const newReferenceValues = parsedInput.referenceValues
        .map((item) => item.id)
        .filter((id): id is number => typeof id === "number");

      if (newReferenceValues.length === 0) {
        await tx
          .delete(referenceValues)
          .where(eq(referenceValues.labPracticeFieldId, parsedInput.id));
      } else {
        await tx
          .delete(referenceValues)
          .where(
            and(
              eq(referenceValues.labPracticeFieldId, parsedInput.id),
              notInArray(referenceValues.id, newReferenceValues),
            ),
          );
      }

      for (const item of parsedInput.referenceValues) {
        if (!item.id) {
          await tx.insert(referenceValues).values({
            ...item,
            labPracticeFieldId: parsedInput.id,
            updatedAt: new Date(),
          });

          continue;
        }

        if (item.id) {
          if (previousReferenceValues.includes(item.id)) {
            await tx
              .update(referenceValues)
              .set({
                ...item,
                updatedAt: new Date(),
              })
              .where(eq(referenceValues.id, item.id));

            continue;
          } else {
            throw new Error("Valor de referencia no encontrado.");
          }
        }
      }

      // Shortcuts
      const previousShortcuts = existingPracticeField.shortcuts.map(
        (item) => item.id,
      );
      const newShortcuts = parsedInput.shortcuts
        .map((item) => item.id)
        .filter((id): id is number => typeof id === "number");

      if (newShortcuts.length === 0) {
        await tx
          .delete(shortcuts)
          .where(eq(shortcuts.labPracticeFieldId, parsedInput.id));
      } else {
        await tx
          .delete(shortcuts)
          .where(
            and(
              eq(shortcuts.labPracticeFieldId, parsedInput.id),
              notInArray(shortcuts.id, newShortcuts),
            ),
          );
      }

      for (const item of parsedInput.shortcuts) {
        if (!item.id) {
          await tx.insert(shortcuts).values({
            ...item,
            labPracticeFieldId: parsedInput.id,
            updatedAt: new Date(),
          });

          continue;
        }

        if (item.id) {
          if (previousShortcuts.includes(item.id)) {
            await tx
              .update(shortcuts)
              .set({
                ...item,
                updatedAt: new Date(),
              })
              .where(eq(shortcuts.id, item.id));

            continue;
          } else {
            throw new Error("Shortcut no encontrado.");
          }
        }
      }
    });

    return updateTransaction;
  });

export const deleteLabPracticeField = actionClient
  .metadata({ actionName: "deleteLabPracticeField" })
  .inputSchema(selectSchema, {
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
