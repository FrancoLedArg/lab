"use server";

import { actionClient } from "@/lib/safe-action";
import { flattenValidationErrors } from "next-safe-action";

// Drizzle
import { db } from "@/lib/db";
import { labPracticeFields } from "@/lib/db/schema/index";

// Validation Schemas
import { createLabPracticeFieldSchema as createSchema } from "@/lib/validation/lab-practice-fields";

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
