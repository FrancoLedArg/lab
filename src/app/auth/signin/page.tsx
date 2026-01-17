"use client";

// Next
import Link from "next/link";
import { useRouter } from "next/navigation";

// React Hook Form
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { signin } from "@/actions/auth";

// Shadcn
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FieldGroup, FieldSet, FieldSeparator } from "@/components/ui/field";
import { toast } from "sonner";

// Zod
import { z } from "zod";

// Components
import TextField from "@/components/form/text-field";
import PasswordField from "@/components/form/password-field";
import SubmitButton from "@/components/form/submit-button";

const schema = z.object({
  email: z.email("El email es invalido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function Page() {
  const router = useRouter();

  const { execute, isExecuting } = useAction(signin, {
    onSuccess: ({ data }) => {
      toast.success(data.message);
      router.push("/");
    },
    onError: ({ error }) => {
      toast.error("Error al iniciar sesión.", {
        description: error.serverError,
      });
    },
  });

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    execute(data);
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <TextField name="email" label="Email" />
                <PasswordField name="password" label="Contraseña" />
                <SubmitButton
                  label="Iniciar sesión"
                  isExecuting={isExecuting}
                />
              </FieldSet>

              <FieldSeparator />
              <FieldSet>
                <p className="text-center">
                  ¿No tienes una cuenta?{" "}
                  <Link
                    href="/auth/signup"
                    className="opacity-60 transition-opacity hover:opacity-100"
                  >
                    Registrate
                  </Link>
                </p>
              </FieldSet>
            </FieldGroup>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
