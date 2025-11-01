import Link from "next/link";
import { withForm } from "@/hooks/form";
import { formOptions } from "./form-options";
import { z } from "zod";

// Shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FieldGroup,
  FieldSet,
  FieldSeparator,
  FieldDescription,
} from "@/components/ui/field";

export const ChildForm = withForm({
  ...formOptions,
  props: {
    title: "Iniciar sesión",
    isExecuting: false,
  },
  render: ({ form, isExecuting }) => {
    form.state.isSubmitting = isExecuting;

    return (
      <Card className='w-full sm:max-w-md'>
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
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

                <form.AppForm>
                  <form.SubscribeButton label='Iniciar sesión' />
                </form.AppForm>
              </FieldSet>

              <FieldSeparator />
              <FieldSet>
                <p className='text-center'>
                  ¿No tienes una cuenta?{" "}
                  <Link
                    href='/auth/signup'
                    className='opacity-60 transition-opacity hover:opacity-100'
                  >
                    Registrate
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
