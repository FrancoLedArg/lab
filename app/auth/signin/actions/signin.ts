"use server";

import { z } from "zod";

const signinSchema = z.object({
  email: z.email("El email es invalido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export async function signinAction(value: z.infer<typeof signinSchema>) {
  try {
    const validatedData = signinSchema.parse(value);

    console.log("Signin attempt:", value);

    return { success: true, message: "Signin successful", data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed",
        errors: error,
      };
    }

    return {
      success: false,
      message: "Signin failed",
      errors: error,
    };
  }
}
