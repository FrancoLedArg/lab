import z from "zod";

const numericIdFromStringSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "El valor debe ser un número entero positivo.")
  .transform((value) => Number(value));

const hierarchyFromStringSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, "La jerarquía debe ser un número entero.")
  .transform((value) => Number(value))
  .refine((value) => value >= 0, {
    message: "La jerarquía no puede ser negativa.",
  })
  .refine((value) => value <= 9999, {
    message: "La jerarquía no puede ser mayor que 9999.",
  });

export const updateHierarchySchema = z.object({
  id: z
    .number()
    .int("El ID del campo debe ser un número entero.")
    .positive("El ID del campo debe ser un número positivo.")
    .transform((value) => Number(value)),
  labPracticeFieldIds: z.array(
    z.object({
      id: z
        .number()
        .int("El ID del campo debe ser un número entero.")
        .positive("El ID del campo debe ser un número positivo.")
        .transform((value) => Number(value)),
    }),
  ),
});
