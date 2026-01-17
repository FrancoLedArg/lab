"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "@/lib/db";
import { practice } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const getAllPractices = actionClient
  .metadata({ actionName: "getAllPractices" })
  .action(async () => {
    const practicesList = await db.query.practice.findMany({
      orderBy: [desc(practice.createdAt)],
    });

    return practicesList;
  });

