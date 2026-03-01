"use client";

// Next
import { useRouter } from "next/navigation";

// React
import { useState } from "react";

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
import { updateSchema as schema } from "@/lib/validation/lab-practice-fields";

// Types
import type {
  LabPracticeField,
  UpdateLabPracticeField as FormSchema,
} from "@/lib/validation/lab-practice-fields";

// Shadcn
import {
  ItemActions,
  ItemTitle,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

// Icons
import { Pencil, Trash } from "lucide-react";

// Components
import TextField from "@/components/form/text-field";
import SubmitButton from "@/components/form/submit-button";

export default function PracticeField({ field }: { field: LabPracticeField }) {
  const [isOpen, setIsOpen] = useState(false);

  const { name, dataType, unit } = field;

  const router = useRouter();

  const { execute, isExecuting } = useAction(updateLabPracticeField, {
    onSuccess: ({ data }) => {
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
      hierarchy: field.hierarchy,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: FormSchema) => {
    execute(data);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full flex flex-col gap-4"
    >
      <div className="w-full flex flex-row justify-between items-center gap-6">
        <ItemContent>
          <ItemTitle>{name}</ItemTitle>
          <ItemDescription>
            {dataType} - {unit}
          </ItemDescription>
        </ItemContent>

        <ItemActions>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil />
            </Button>
          </CollapsibleTrigger>

          <Button variant="ghost" size="icon">
            <Trash />
          </Button>
        </ItemActions>
      </div>

      <CollapsibleContent className="w-full flex flex-col gap-4">
        <Separator />

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
                        {/*DATA_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))*/}
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
                <Button type="button" variant="outline" disabled={isExecuting}>
                  Cancelar
                </Button>
              </div>
            </FieldGroup>
          </form>
        </FormProvider>
      </CollapsibleContent>
    </Collapsible>
  );
}
