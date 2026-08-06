import { headers } from "next/headers";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

import { auth } from "@/server/auth";

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof ActionError) {
      return error.message;
    }
    console.error("[safe-action]", error);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

/** Requires a signed-in session with an active organization (Lab). */
export const labActionClient = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new ActionError("Unauthorized");
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    throw new ActionError("Active organization required");
  }

  return next({
    ctx: {
      session,
      user: session.user,
      organizationId,
    },
  });
});
