import { withForm } from "@/hooks/form";
import { formOptions } from "./form-options";
import { z } from "zod";

export const ChildForm = withForm({
  ...formOptions,
  props: {
    title: "Iniciar sesión",
  },
  render: ({ form }) => {
    return (
      <form
        className='flex-col gap-xl'
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
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
      </form>
    );
  },
});
