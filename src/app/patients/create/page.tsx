"use client";

import { useRouter } from "next/navigation";

// Form
import { ChildForm } from "./features/child-form";
import { formOptions } from "./features/form-options";
import { useAppForm } from "@/hooks/form";

// Actions
import { useAction } from "next-safe-action/hooks";
import { createPatient } from "@/actions/patients";

// Shadcn
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();

  const { execute, isExecuting } = useAction(createPatient, {
    onSuccess: ({ data }) => {
      toast.success(data.message);
      router.push("/patients");
    },
    onError: ({ error }) => {
      toast.error("Error al crear el paciente.", {
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
    <ChildForm form={form} title="Crear Paciente" isExecuting={isExecuting} />
  );
}
