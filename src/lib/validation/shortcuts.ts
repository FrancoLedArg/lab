// Zod
import { z } from "zod";

export const shortcutsSchema = z.object({
  id: z
    .number()
    .int("El ID del atajo debe ser un número entero.")
    .positive("El ID del atajo debe ser un número positivo."),
  labPracticeFieldId: z
    .number()
    .int("El ID del campo de laboratorio debe ser un número entero.")
    .positive("El ID del campo de laboratorio debe ser un número positivo."),
  label: z
    .string()
    .trim()
    .min(1, "El atajo no puede estar vacío.")
    .max(255, "El atajo no puede superar los 255 caracteres."),
  value: z
    .string()
    .trim()
    .min(1, "El valor del atajo no puede estar vacío.")
    .max(255, "El valor del atajo no puede superar los 255 caracteres."),
  createdAt: z.date("La fecha de creación debe ser una fecha."),
  updatedAt: z.date("La fecha de actualización debe ser una fecha."),
});

export const selectSchema = shortcutsSchema.pick({
  id: true,
});

export const insertSchema = shortcutsSchema.pick({
  labPracticeFieldId: true,
});

export const updateSchema = shortcutsSchema
  .pick({
    id: true,
    label: true,
    value: true,
  })
  .partial({
    label: true,
    value: true,
  });

export type Shortcuts = z.infer<typeof shortcutsSchema>;
export type InsertShortcuts = z.infer<typeof insertSchema>;

