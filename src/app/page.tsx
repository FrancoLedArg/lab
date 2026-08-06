import Link from "next/link";
import { headers } from "next/headers";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.session.activeOrganizationId ?? null;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Lab</h1>
        <p className="text-muted-foreground">
          Clinical diagnostic lab desk scaffold (Better Auth + Drizzle).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>
            Desk mutations require an active organization (Lab).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          {session ? (
            <>
              <p>
                Signed in as <strong>{session.user.email}</strong>
              </p>
              <p>
                Active organization:{" "}
                <strong>
                  {organizationId ?? "none — set before desk work"}
                </strong>
              </p>
            </>
          ) : (
            <p>Not signed in.</p>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            {session ? (
              <form
                action={async () => {
                  "use server";
                  const { headers: getHeaders } = await import("next/headers");
                  await auth.api.signOut({ headers: await getHeaders() });
                }}
              >
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Sign out
                </button>
              </form>
            ) : (
              <>
                <Link href="/sign-in" className={cn(buttonVariants())}>
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Create Lab
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
