"use client";

// Hooks
import { useRouter } from "next/navigation";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createLabPractice } from "@/actions/lab-practices";

// Shadcn
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// Phosphor
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

export default function NewPracticeButton() {
  const router = useRouter();

  const { execute, isExecuting } = useAction(createLabPractice, {
    onSuccess: ({ data }) => {
      toast.success("Práctica creada correctamente.");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error("Error al crear la práctica.", {
        description: error.serverError,
      });
    },
  });

  return (
    <Button onClick={() => execute()} disabled={isExecuting}>
      {isExecuting ? (
        <Spinner />
      ) : (
        <>
          <PlusIcon />
          Nueva práctica
        </>
      )}
    </Button>
  );
}
