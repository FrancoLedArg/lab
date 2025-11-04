import Link from "next/link";
import { withForm } from "@/hooks/form";
import { formOptions } from "./form-options";
import { z } from "zod";

// Shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FieldGroup, FieldSet, FieldSeparator } from "@/components/ui/field";

export const ChildForm = withForm({
  ...formOptions,
  props: {
    title: "Crear Paciente",
    isExecuting: false,
  },
  render: ({ form, isExecuting }) => {
    form.state.isSubmitting = isExecuting;

    return (
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Crear Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <FieldSet>
                <form.AppField
                  name="id"
                  validators={{
                    onBlur: z
                      .string()
                      .min(1, "El documento de identidad es requerido")
                      .regex(
                        /^\d+$/,
                        "El documento de identidad debe ser un número"
                      ),
                    onChange: ({ fieldApi }) => {
                      if (!fieldApi.state.meta.isBlurred) return;
                      fieldApi.validate("blur");
                    },
                  }}
                  children={(field) => (
                    <field.TextField label="Documento de Identidad" />
                  )}
                />

                <form.AppField
                  name="firstName"
                  validators={{
                    onBlur: z.string().min(1, "El nombre es requerido"),
                    onChange: ({ fieldApi }) => {
                      if (!fieldApi.state.meta.isBlurred) return;
                      fieldApi.validate("blur");
                    },
                  }}
                  children={(field) => <field.TextField label="Nombre" />}
                />

                <form.AppField
                  name="lastName"
                  validators={{
                    onBlur: z.string().min(1, "El apellido es requerido"),
                    onChange: ({ fieldApi }) => {
                      if (!fieldApi.state.meta.isBlurred) return;
                      fieldApi.validate("blur");
                    },
                  }}
                  children={(field) => <field.TextField label="Apellido" />}
                />

                <form.AppField
                  name="phone"
                  validators={{
                    onBlur: z
                      .string()
                      .min(1, "El teléfono es requerido")
                      .regex(
                        /^\+?[\d\s-()]+$/,
                        "El formato del teléfono no es válido"
                      ),
                    onChange: ({ fieldApi }) => {
                      if (!fieldApi.state.meta.isBlurred) return;
                      fieldApi.validate("blur");
                    },
                  }}
                  children={(field) => <field.TextField label="Teléfono" />}
                />

                <form.AppForm>
                  <form.SubscribeButton label="Crear Paciente" />
                </form.AppForm>
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
        </CardContent>
      </Card>
    );
  },
});
