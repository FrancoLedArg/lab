"use client";

// Next
import Link from "next/link";
import { useRouter } from "next/navigation";

// React Hook Form
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { updatePatient } from "@/actions/patients";

// Shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FieldGroup, FieldSet, FieldSeparator } from "@/components/ui/field";
import { toast } from "sonner";

// Zod
import { z } from "zod";

// Components
import TextField from "@/components/Form/text-field";
import SubmitButton from "@/components/Form/submit-button";

// Types
import type { InferSelectModel } from "drizzle-orm";
import type { patient } from "@/lib/db/schema";

type Patient = InferSelectModel<typeof patient>;

const schema = z.object({
  id: z
    .string()
    .min(1, "El documento de identidad es requerido")
    .regex(/^\d+$/, "El documento de identidad debe ser un número"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(/^\+?[\d\s-()]+$/, "El formato del teléfono no es válido"),
});

type FormValues = z.infer<typeof schema>;

interface FormProps {
  patient: Patient;
}

export function Form({ patient }: FormProps) {
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

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: patient.id.toString(),
      firstName: patient.firstName,
      lastName: patient.lastName,
      phone: patient.phone,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    execute(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Paciente</h1>
        <p className="text-muted-foreground mt-2">
          Actualiza la información del paciente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <FieldSet>
                  <TextField name="id" label="Documento de Identidad" disabled />
                  <TextField name="firstName" label="Nombre" />
                  <TextField name="lastName" label="Apellido" />
                  <TextField name="phone" label="Teléfono" />
                  <SubmitButton
                    label="Actualizar Paciente"
                    isExecuting={isExecuting}
                  />
                </FieldSet>

                <FieldSeparator />
                <FieldSet>
                  <p className="text-center">
                    <Link
                      href="/patients"
                      className="opacity-60 transition-opacity hover:opacity-100"
                    >
                      ← Volver a la lista de pacientes
                    </Link>
                  </p>
                </FieldSet>
              </FieldGroup>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
