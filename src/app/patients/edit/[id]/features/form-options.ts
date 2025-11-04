import { z } from "zod";

export const formOptions = {
  validators: {
    onSubmit: z.object({
      id: z
        .string()
        .min(1, "El documento de identidad es requerido")
        .regex(/^\d+$/, "El documento de identidad debe ser un número"),
      firstName: z.string().min(1, "El nombre es requerido"),
      lastName: z.string().min(1, "El apellido es requerido"),
      phone: z
        .string()
        .min(1, "El teléfono es requerido")
        .regex(/^\+?[\d\s-()]+$/, "El formato del teléfono no es válido"),
    }),
  },
};
