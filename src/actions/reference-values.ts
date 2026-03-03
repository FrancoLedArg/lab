"use server";

import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Drizzle
import { db } from "@/lib/db";
// import { eq } from "drizzle-orm";
import { referenceValues } from "@/lib/db/schema/index";

// Validation Schemas
import {
  selectSchema,
  insertSchema,
  updateSchema,
} from "@/lib/validation/reference-values";

export const createReferenceValues = actionClient
  .metadata({ actionName: "createReferenceValues" })
  .inputSchema(insertSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const { labPracticeFieldId } = parsedInput;

    const newReferenceValues = await db
      .insert(referenceValues)
      .values({
        labPracticeFieldId,
        name: "Valor de referencia",
        minRange: 0,
        maxRange: 100,
      })
      .returning();

    return newReferenceValues;
  });

export const updateReferenceValues = actionClient
  .metadata({ actionName: "updateReferenceValues" })
  .inputSchema(updateSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const { id, name, minRange, maxRange } = parsedInput;
  });

export const deleteReferenceValues = actionClient
  .metadata({ actionName: "deleteReferenceValues" })
  .inputSchema(selectSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
  });
