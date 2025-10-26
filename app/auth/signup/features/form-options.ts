import { z } from "zod";

export const formOptions = {
  defaultValues: {
    email: "",
    password: "",
  },
  validators: {
    onSubmit: z.object({
      email: z.string().email("El email es invalido"),
      password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    }),
  },
};
