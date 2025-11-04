"use client";

import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { updatePatient } from "@/actions/patients";
import { useAppForm } from "@/hooks/form";
import { formOptions } from "./form-options";
import { ChildForm } from "./child-form";
import { toast } from "sonner";
import type { InferSelectModel } from "drizzle-orm";
import type { patient } from "@/lib/db/schema";

type Patient = InferSelectModel<typeof patient>;

interface EditPatientFormProps {
  patient: Patient;
}

export function EditPatientForm({ patient }: EditPatientFormProps) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(updatePatient, {
    onSuccess: ({ data }) => {
      toast.success(data.message);
      router.push("/patients");
    },
    onError: ({ error }) => {
      toast.error("Error al actualizar el paciente.", {
        description: error.serverError,
      });
    },
  });

  const form = useAppForm({
    ...formOptions,
    defaultValues: {
      id: patient.id.toString(),
      firstName: patient.firstName,
      lastName: patient.lastName,
      phone: patient.phone,
    },
    onSubmit: async ({ value }) => {
      execute(value);
    },
  });

  return (
    <ChildForm form={form} title="Editar Paciente" isExecuting={isExecuting} />
  );
}
