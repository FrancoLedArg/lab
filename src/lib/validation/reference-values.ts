// Zod
import { z } from "zod";

export const referenceValuesSchema = z.object({
  id: z
    .number()
    .int("El ID de los valores de referencia debe ser un número entero.")
    .positive(
      "El ID de los valores de referencia debe ser un número positivo.",
    ),
  labPracticeFieldId: z
    .number()
    .int("El ID del campo de laboratorio debe ser un número entero.")
    .positive("El ID del campo de laboratorio debe ser un número positivo."),
  name: z
    .string()
    .trim()
    .min(1, "El nombre de los valores de referencia no puede estar vacío.")
    .max(
      255,
      "El nombre de los valores de referencia no puede superar los 255 caracteres.",
    ),
  minRange: z
    .number()
    .int("El rango mínimo debe ser un número entero.")
    .positive("El rango mínimo debe ser un número positivo."),
  maxRange: z
    .number()
    .int("El rango máximo debe ser un número entero.")
    .positive("El rango máximo debe ser un número positivo."),
  createdAt: z.date("La fecha de creación debe ser una fecha."),
  updatedAt: z.date("La fecha de actualización debe ser una fecha."),
});

export type ReferenceValues = z.infer<typeof referenceValuesSchema>;
