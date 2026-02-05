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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Phosphor
import { GoogleLogoIcon } from "@phosphor-icons/react";

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
    <Card className="w-full sm:max-w-md gap-8">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Sistema de Laboratorio</CardTitle>
        <CardDescription>
          Inicia sesión para acceder a tu cuenta
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <TextField name="email" label="Email" />
              <PasswordField name="password" label="Contraseña" />
              <SubmitButton label="Iniciar sesión" isExecuting={isExecuting} />
            </FieldGroup>
          </form>
        </FormProvider>

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          O continua con
        </FieldSeparator>

        <FieldGroup className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button">
            <GoogleLogoIcon className="size-4" />
            <span className="sr-only">Inicia Sesion con Google</span>
          </Button>

          <Button variant="outline" type="button">
            <GoogleLogoIcon className="size-4" />
            <span className="sr-only">Inicia Sesion con Google</span>
          </Button>
        </FieldGroup>

        <FieldDescription className="text-center">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/signup" className="underline-none">
            Registrate
          </Link>
        </FieldDescription>
      </CardContent>
    </Card>
  );
}
