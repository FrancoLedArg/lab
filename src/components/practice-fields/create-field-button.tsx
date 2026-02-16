"use client";

// Hooks
import { useRouter } from "next/navigation";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createLabPracticeField } from "@/actions/lab-practice-fields";

// Shadcn
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// Phosphor
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

interface CreateLabPracticeFieldInput {
  labPracticeId: number;
  hierarchy: number;
}
export default function CreateFieldButton({
  data,
}: {
  data: CreateLabPracticeFieldInput;
}) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(createLabPracticeField, {
    onSuccess: ({ data }) => {
      toast.success("Campo creado correctamente.");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error("Error al crear el campo.", {
        description: error.serverError,
      });
    },
  });

  return (
    <Button
      variant="outline"
      onClick={() => execute(data)}
      disabled={isExecuting}
    >
      {isExecuting ? (
        <Spinner />
      ) : (
        <>
          <PlusIcon />
          Nuevo Campo
        </>
      )}
    </Button>
  );
}
