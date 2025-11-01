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
    title: "Registrarse",
    isExecuting: false,
  },
  render: ({ form, isExecuting }) => {
    form.state.isSubmitting = isExecuting;

    return (
      <Card className='w-full sm:max-w-md'>
        <CardHeader>
          <CardTitle>Registrarse</CardTitle>
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
                  name='name'
                  validators={{
                    onBlur: z.string().min(1, "El nombre es requerido"),
                    onChange: ({ fieldApi }) => {
                      if (!fieldApi.state.meta.isBlurred) return;

                      fieldApi.validate("blur");
                    },
                  }}
                  children={(field) => <field.TextField label='Nombre' />}
                />

                <form.AppField
                  name='email'
                  validators={{
                    onBlur: z.email("El email es invalido"),
                    onChange: ({ fieldApi }) => {
                      if (!fieldApi.state.meta.isBlurred) return;

                      fieldApi.validate("blur");
                    },
                  }}
                  children={(field) => <field.TextField label='Email' />}
                />

                <form.AppField
                  name='password'
                  validators={{
                    onBlur: z
                      .string()
                      .min(8, "La contraseña debe tener al menos 8 caracteres"),
                    onChange: ({ fieldApi }) => {
                      if (!fieldApi.state.meta.isBlurred) return;

                      fieldApi.validate("blur");
                    },
                  }}
                  children={(field) => (
                    <field.PasswordField label='Contraseña' />
                  )}
                />

                <form.AppField
                  name='confirmPassword'
                  validators={{
                    onBlur: z
                      .string()
                      .min(8, "La contraseña debe tener al menos 8 caracteres"),
                    onChange: ({ fieldApi }) => {
                      if (!fieldApi.state.meta.isBlurred) return;

                      fieldApi.validate("blur");
                    },
                  }}
                  children={(field) => (
                    <field.PasswordField label='Confirmar contraseña' />
                  )}
                />

                <form.AppForm>
                  <form.SubscribeButton label='Registrarse' />
                </form.AppForm>
              </FieldSet>

              <FieldSeparator />
              <FieldSet>
                <p className='text-center'>
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    href='/auth/signin'
                    className='opacity-60 transition-opacity hover:opacity-100'
                  >
                    Inicia sesión
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
