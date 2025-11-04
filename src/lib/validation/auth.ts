import { z } from "zod";

export const signinSchema = z.object({
  email: z.email("El email es invalido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const signupSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.email("El email es invalido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });
