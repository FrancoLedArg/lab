import z from "zod";

export const createLabPracticeFieldSchema = z.object({
  labPracticeId: z.number(),
  hierarchy: z.number(),
});
