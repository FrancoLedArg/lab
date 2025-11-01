"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { flattenValidationErrors } from "next-safe-action";
import { actionClient } from "@/lib/safe-action";

// Validation Schemas
import { signinSchema, signupSchema } from "@/lib/validation/auth";

export const signin = actionClient
  .metadata({ actionName: "signin" })
  .inputSchema(signinSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session) {
      throw new Error(
        "Ya existe una sesión activa. Por favor, cierre la sesión actual para iniciar sesión nuevamente."
      );
    }

    const { email, password } = parsedInput;

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      message: "Sesión iniciada correctamente.",
    };
  });

export const signup = actionClient
  .metadata({ actionName: "signup" })
  .inputSchema(signupSchema, {
    handleValidationErrorsShape: async (errors) => {
      return flattenValidationErrors(errors).fieldErrors;
    },
  })
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session) {
      throw new Error(
        "Ya existe una sesión activa. Por favor, cierre la sesión actual para registrarse nuevamente."
      );
    }

    const { name, email, password } = parsedInput;

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return {
      message: "Usuario creado correctamente.",
    };
  });

export const signout = actionClient
  .metadata({ actionName: "signout" })
  .action(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("No hay una sesión activa.");
    }

    await auth.api.signOut({
      headers: await headers(),
    });

    return {
      message: "Sesión cerrada correctamente.",
    };
  });
