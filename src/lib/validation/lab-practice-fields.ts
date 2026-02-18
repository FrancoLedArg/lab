import z from "zod";

export const dataTypeSchema = z.enum([
  "TEXT",
  "NUMBER",
  "BOOLEAN",
  "CALCULATED",
]);

export const labPracticeFieldSchema = z.object({
  id: z
    .number()
    .int("El ID del campo debe ser un número entero.")
    .positive("El ID del campo debe ser un número positivo."),
  labPracticeId: z
    .number()
    .int("El ID de la práctica de laboratorio debe ser un número entero.")
    .positive(
      "El ID de la práctica de laboratorio debe ser un número positivo.",
    )
    .nullable(),
  name: z
    .string()
    .trim()
    .min(1, "El nombre del campo no puede estar vacío.")
    .max(255, "El nombre del campo no puede superar los 255 caracteres."),
  dataType: dataTypeSchema,
  unit: z
    .string()
    .trim()
    .min(1, "La unidad no puede estar vacía.")
    .max(50, "La unidad no puede superar los 50 caracteres."),
  hierarchy: z
    .number()
    .int("La jerarquía debe ser un número entero.")
    .nonnegative("La jerarquía no puede ser negativa.")
    .max(9999, "La jerarquía no puede ser mayor que 9999."),
  createdAt: z.date(),
  updatedAt: z.date(),
});

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

export const createLabPracticeFieldSchema = z.object({
  labPracticeId: z
    .union([
      z
        .number()
        .int("El ID de la práctica de laboratorio debe ser un número entero.")
        .positive(
          "El ID de la práctica de laboratorio debe ser un número positivo.",
        ),
      numericIdFromStringSchema,
    ])
    .transform((value) => Number(value)),
  hierarchy: z
    .union([
      z
        .number()
        .int("La jerarquía debe ser un número entero.")
        .nonnegative("La jerarquía no puede ser negativa.")
        .max(9999, "La jerarquía no puede ser mayor que 9999."),
      hierarchyFromStringSchema,
    ])
    .transform((value) => Number(value)),
});

export const updateLabPracticeFieldSchema = z.object({
  id: z
    .union([
      z
        .number()
        .int("El ID del campo debe ser un número entero.")
        .positive("El ID del campo debe ser un número positivo."),
      numericIdFromStringSchema,
    ])
    .transform((value) => Number(value)),
  name: labPracticeFieldSchema.shape.name,
  dataType: dataTypeSchema,
  unit: labPracticeFieldSchema.shape.unit,
  hierarchy: z
    .union([labPracticeFieldSchema.shape.hierarchy, hierarchyFromStringSchema])
    .transform((value) => Number(value)),
});

export const deleteLabPracticeFieldSchema = z.object({
  id: z
    .union([
      z
        .number()
        .int("El ID del campo debe ser un número entero.")
        .positive("El ID del campo debe ser un número positivo."),
      numericIdFromStringSchema,
    ])
    .transform((value) => Number(value)),
});

export type LabPracticeField = z.infer<typeof labPracticeFieldSchema>;
export type CreateLabPracticeFieldInput = z.infer<
  typeof createLabPracticeFieldSchema
>;
export type DeleteLabPracticeFieldInput = z.infer<
  typeof deleteLabPracticeFieldSchema
>;
export type UpdateLabPracticeFieldInput = z.infer<
  typeof updateLabPracticeFieldSchema
>;
