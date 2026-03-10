"use client";

// Next
import { useRouter } from "next/navigation";

// React Hook Form
import {
  FormProvider,
  useForm,
  type Resolver,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { updateLabPracticeField } from "@/actions/lab-practice-fields";

// Validation Schemas
import { updateSchema as schema } from "@/lib/validation/lab-practice-fields";

// Types
import type {
  LabPracticeField,
  UpdateLabPracticeField as FormSchema,
} from "@/lib/validation/lab-practice-fields";

// Shadcn
import { Separator } from "@/components/ui/separator";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Components
import TextField from "@/components/form/text-field";
import SelectField from "@/components/form/select-field";
import SubmitButton from "@/components/form/submit-button";
import ReferenceValuesGroup from "./reference-values-group";
import ShortcutsGroup from "./shortcuts-group";

export default function PracticeFieldForm({
  field,
}: {
  field: LabPracticeField;
}) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(updateLabPracticeField, {
    onSuccess: () => {
      toast.success("Campo actualizado.");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error("Error al actualizar el campo.", {
        description: error.serverError as string,
      });
    },
  });

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema) as Resolver<FormSchema>,
    defaultValues: {
      id: field.id,
      name: field.name,
      dataType: field.dataType,
      unit: field.unit,
      referenceValues: field.referenceValues,
      shortcuts: field.shortcuts,
    },
  });

  const { handleSubmit } = methods;

  const onValid = (data: FormSchema) => {
    execute(data);
  };

  const onInvalid = (errors: FieldErrors<FormSchema>) => {
    void errors;
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        onClick={(e) => e.stopPropagation()}
        className="w-full flex flex-col gap-4"
      >
        <FieldGroup className="gap-3">
          <TextField name="name" label="Nombre" />
          <SelectField
            name="dataType"
            label="Tipo de dato"
            options={["TEXT", "NUMBER", "BOOLEAN", "CALCULATED"]}
          />
          <TextField name="unit" label="Unidad" />
        </FieldGroup>

        <Separator />

        <ReferenceValuesGroup />

        <Separator />

        <ShortcutsGroup />

        <div className="flex gap-2 pt-1">
          <SubmitButton label="Guardar" isExecuting={isExecuting} />
          <Button type="button" variant="outline" disabled={isExecuting}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
