// Zod
import { z } from "zod";

// Validation Schemas
import { referenceValuesSchema } from "@/lib/validation/reference-values";

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
    ),
  name: z
    .string()
    .trim()
    .min(1, "El nombre del campo no puede estar vacío.")
    .max(255, "El nombre del campo no puede superar los 255 caracteres."),
  dataType: z.enum(["TEXT", "NUMBER", "BOOLEAN", "CALCULATED"]),
  unit: z
    .string()
    .trim()
    .min(1, "La unidad no puede estar vacía.")
    .max(50, "La unidad no puede superar los 50 caracteres."),
  hierarchy: z
    .number()
    .int("La jerarquía debe ser un número entero.")
    .positive("La jerarquía debe ser un número positivo."),
  createdAt: z.date("La fecha de creación debe ser una fecha."),
  updatedAt: z.date("La fecha de actualización debe ser una fecha."),
  referenceValues: z.array(referenceValuesSchema),
});

export const selectSchema = labPracticeFieldSchema.pick({
  id: true,
});
export const insertSchema = labPracticeFieldSchema.pick({
  labPracticeId: true,
  hierarchy: true,
});
export const updateSchema = labPracticeFieldSchema.partial({
  labPracticeId: true,
  name: true,
  dataType: true,
  unit: true,
  hierarchy: true,
});

export type LabPracticeField = z.infer<typeof labPracticeFieldSchema>;
export type SelectLabPracticeField = z.infer<typeof selectSchema>;
export type InsertLabPracticeField = z.infer<typeof insertSchema>;
export type UpdateLabPracticeField = z.infer<typeof updateSchema>;
