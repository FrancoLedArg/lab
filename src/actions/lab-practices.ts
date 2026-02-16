"use server";

import { actionClient } from "@/lib/safe-action";

// Drizzle
import { db } from "@/lib/db";
import { labPractices } from "@/lib/db/schema/index";

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
