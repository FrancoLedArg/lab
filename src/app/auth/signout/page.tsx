"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

// Shadcn
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();

  const handleClick = async () => {
    await authClient.signOut();
    toast.success("Sesión cerrada correctamente");
    router.push("/auth/signin");
  };

  return (
    <>
      <Button onClick={handleClick}>Cerrar sesión</Button>
    </>
  );
}
