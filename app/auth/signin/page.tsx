"use client";

import { redirect } from "next/navigation";

// Form
import { ChildForm } from "./features/child-form";
import { formOptions } from "./features/form-options";
import { useAppForm } from "@/hooks/form";

// Actions
import { useAction } from "next-safe-action/hooks";
import { signin } from "@/actions/auth";

// Shadcn
import { toast } from "sonner";

export default function Page() {
  const { execute, isExecuting } = useAction(signin, {
    onSuccess: ({ data }) => {
      toast.success(data.message);

      redirect("/");
    },
    onError: ({ error }) => {
      toast.error("Error al iniciar sesión.", {
        description: error.serverError,
      });
    },
  });

  const form = useAppForm({
    ...formOptions,
    onSubmit: async ({ value }) => {
      execute(value);
    },
  });
  return (
    <ChildForm form={form} title='Iniciar sesión' isExecuting={isExecuting} />
  );
}
