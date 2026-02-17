"use client";

// Hooks
import { useRouter } from "next/navigation";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import type { SafeActionFn, InferSafeActionFnInput } from "next-safe-action";

// Shadcn
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type ActionInput<T extends SafeActionFn<any, any, any, any, any>> =
  InferSafeActionFnInput<T>["clientInput"];

export default function SafeActionButton<
  TAction extends SafeActionFn<any, any, any, any, any>,
>({
  safeAction,
  input,
  children,
}: {
  safeAction: TAction;
  input: ActionInput<TAction>;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(safeAction, {
    onSuccess: ({ data }) => {
      toast.success("Práctica creada correctamente.");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error("Error al crear la práctica.", {
        description: error.serverError as string,
      });
    },
  });

  const handleClick = () => {
    console.log("clicked", input);
    execute(input);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isExecuting}
    >
      {isExecuting ? <Spinner /> : children}
    </Button>
  );
}
