"use client";

// Next
import Link from "next/link";
import { useRouter } from "next/navigation";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { signup } from "@/actions/auth";

// React Hook Form
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

// Zod
import { z } from "zod";

// Components
import TextField from "@/components/form/text-field";
import PasswordField from "@/components/form/password-field";
import SubmitButton from "@/components/form/submit-button";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El email es invalido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function Form() {
  const router = useRouter();

  const { execute, isExecuting } = useAction(signup, {
    onSuccess: ({ data }) => {
      toast.success(data.message);
      router.push("/auth/signin");
    },
    onError: ({ error }) => {
      toast.error("Error al crear el usuario.", {
        description: error.serverError,
      });
    },
  });

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: FormValues) => {
    execute(data);
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Crea una cuenta</CardTitle>
        <CardDescription>
          Ingresa tus datos para crear una cuenta
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <TextField name="name" label="Nombre" />

              <TextField name="email" label="Email" />

              <PasswordField name="password" label="Contraseña" />

              <PasswordField
                name="confirmPassword"
                label="Confirmar contraseña"
              />

              <SubmitButton label="Registrarse" isExecuting={isExecuting} />
            </FieldGroup>
          </form>
        </FormProvider>
      </CardContent>

      <FieldDescription className="text-center">
        Ya tienes una cuenta?{" "}
        <Link href="/auth/signin" className="underline-none">
          Inicia sesión
        </Link>
      </FieldDescription>
    </Card>
  );
}
