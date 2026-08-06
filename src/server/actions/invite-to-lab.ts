"use server";

import { z } from "zod";

import { ActionError, labActionClient } from "@/lib/safe-action";
import { auth } from "@/server/auth";
import { headers } from "next/headers";

const inviteSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]),
});

/**
 * Owner/Admin invite to a Lab. Owner role is never inviteable (ADR-0004).
 * Better Auth enforces that the actor can invite; we additionally lock roles.
 */
export const inviteToLab = labActionClient
  .inputSchema(inviteSchema)
  .action(async ({ parsedInput, ctx }) => {
    const result = await auth.api.createInvitation({
      headers: await headers(),
      body: {
        email: parsedInput.email,
        role: parsedInput.role,
        organizationId: ctx.organizationId,
      },
    });

    if (!result) {
      throw new ActionError("Could not create invitation");
    }

    return { invitationId: result.id };
  });
