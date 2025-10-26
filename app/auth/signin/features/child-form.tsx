import { withForm } from "@/hooks/form";
import { formOptions } from "./form-options";
import { z } from "zod";

// Shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

export const ChildForm = withForm({
  ...formOptions,
  props: {
    title: "Iniciar sesión",
  },
  render: ({ form }) => {
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
              <form.AppField
                name='email'
                validators={{
                  onChange: z.string().email("El email es invalido"),
                }}
                children={(field) => <field.TextField label='Email' />}
              />

              <form.AppField
                name='password'
                validators={{
                  onChange: z
                    .string()
                    .min(8, "La contraseña debe tener al menos 8 caracteres"),
                }}
                children={(field) => <field.PasswordField label='Contraseña' />}
              />

              <form.AppForm>
                <form.SubscribeButton label='Iniciar sesión' />
              </form.AppForm>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    );
  },
});
