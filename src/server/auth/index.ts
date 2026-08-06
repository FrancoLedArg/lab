import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";

import { db } from "@/server/db";
import * as schema from "@/server/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      creatorRole: "owner",
      async sendInvitationEmail(data) {
        const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
        const inviteLink = `${baseUrl}/accept-invitation/${data.id}`;
        console.info("[auth] invitation email stub", {
          to: data.email,
          role: data.role,
          organization: data.organization.name,
          inviteLink,
          invitedBy: data.inviter.user.email,
        });
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
