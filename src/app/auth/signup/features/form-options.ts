import { z } from "zod";

export const formOptions = {
  defaultValues: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  validators: {
    onSubmit: z.object({
      name: z.string().min(1, "El nombre es requerido"),
      email: z.email("El email es invalido"),
      password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
      confirmPassword: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    }),
  },
};
