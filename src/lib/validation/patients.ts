import { z } from "zod";

export const createPatientSchema = z.object({
  id: z.coerce
    .number("El documento de identidad debe ser un número")
    .min(1, "El documento de identidad es requerido")
    .int("El documento de identidad debe ser un número entero")
    .positive("El documento de identidad debe ser un número positivo"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(/^\+?[\d\s-()]+$/, "El formato del teléfono no es válido"),
});

export const updatePatientSchema = z.object({
  id: z.coerce
    .number("El documento de identidad debe ser un número")
    .min(1, "El documento de identidad es requerido")
    .int("El documento de identidad debe ser un número entero")
    .positive("El documento de identidad debe ser un número positivo"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(/^\+?[\d\s-()]+$/, "El formato del teléfono no es válido"),
});
