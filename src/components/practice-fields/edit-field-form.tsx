"use client";

// Next
import { useRouter } from "next/navigation";

// React Hook Form
import {
  Controller,
  FormProvider,
  useForm,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { get } from "react-hook-form";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { updateLabPracticeField } from "@/actions/lab-practice-fields";

// Validation Schemas
import {
  updateLabPracticeFieldSchema as schema,
  dataTypeSchema,
} from "@/lib/validation/lab-practice-fields";

// Shadcn
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Zod
import { z } from "zod";

// Components
import TextField from "@/components/form/text-field";
import SubmitButton from "@/components/form/submit-button";

type FormValues = z.output<typeof schema>;
type DataType = z.infer<typeof dataTypeSchema>;

const DATA_TYPE_OPTIONS: DataType[] = [
  "TEXT",
  "NUMBER",
  "BOOLEAN",
  "CALCULATED",
];

export type EditFieldFormField = {
  id: number;
  name: string;
  dataType: DataType;
  unit: string;
  hierarchy: number;
};

export default function EditFieldForm({
  field,
  onSuccess,
  onCancel,
}: {
  field: EditFieldFormField;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(updateLabPracticeField, {
    onSuccess: ({ data }) => {
      toast.success("Campo actualizado.");
      onSuccess?.();
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error("Error al actualizar el campo.", {
        description: error.serverError as string,
      });
    },
  });

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      id: field.id,
      name: field.name,
      dataType: field.dataType,
      unit: field.unit,
      hierarchy: field.hierarchy,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: FormValues) => {
    execute(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
        className="w-full"
      >
        <FieldGroup className="gap-3">
          <TextField name="name" label="Nombre" />
          <Controller
            name="dataType"
            control={control}
            render={({ field: selectField }) => (
              <Field>
                <FieldLabel htmlFor="dataType">Tipo de dato</FieldLabel>
                <Select
                  value={selectField.value}
                  onValueChange={selectField.onChange}
                >
                  <SelectTrigger id="dataType" className="w-full">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {get(errors, "dataType")?.message && (
                  <FieldError
                    errors={[
                      {
                        message: get(errors, "dataType")?.message as string,
                      },
                    ]}
                  />
                )}
              </Field>
            )}
          />
          <TextField name="unit" label="Unidad" />
          <div className="flex gap-2 pt-1">
            <SubmitButton label="Guardar" isExecuting={isExecuting} />
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isExecuting}
            >
              Cancelar
            </Button>
          </div>
        </FieldGroup>
      </form>
    </FormProvider>
  );
}
