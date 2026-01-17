import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Obtiene la sesión actual del usuario en server components
 */
export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}
