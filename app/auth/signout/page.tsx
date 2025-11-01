"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { redirect } from "next/navigation";

// Shadcn
import { toast } from "sonner";

export default function Page() {
  const handleClick = async () => {
    await authClient.signOut();
    toast.success("Sesión cerrada correctamente");
    redirect("/auth/signin");
  };

  return (
    <>
      <Button onClick={handleClick}>Cerrar sesión</Button>
    </>
  );
}
