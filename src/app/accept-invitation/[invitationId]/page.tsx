"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function AcceptInvitationPage() {
  const params = useParams<{ invitationId: string }>();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function acceptAfterAuth() {
    const result = await authClient.organization.acceptInvitation({
      invitationId: params.invitationId,
    });

    if (result.error) {
      throw new Error(result.error.message ?? "Could not accept invitation");
    }

    const organizationId = result.data?.member?.organizationId;
    if (organizationId) {
      await authClient.organization.setActive({ organizationId });
    }

    router.push("/");
    router.refresh();
  }

  async function onAccept() {
    setError(null);
    setPending(true);

    try {
      await acceptAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  async function onCreateAccountAndAccept(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const signUp = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (signUp.error) {
        setError(signUp.error.message ?? "Could not create account");
        return;
      }

      await acceptAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Invite</CardTitle>
          <CardDescription>
            Join this Lab as Admin or Member. This is not product signup — no
            new Lab is created.
          </CardDescription>
        </CardHeader>
        {session?.user ? (
          <>
            <CardContent className="grid gap-2">
              <p className="text-sm text-muted-foreground">
                Signed in as {session.user.email}
              </p>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={onAccept} disabled={pending}>
                {pending ? "Accepting…" : "Accept invitation"}
              </Button>
            </CardFooter>
          </>
        ) : (
          <form onSubmit={onCreateAccountAndAccept}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Invited email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Joining…" : "Create account & join Lab"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
                , then return to this Invite link.
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
    </main>
  );
}
