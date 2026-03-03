"use client";

// Next
import { useRouter } from "next/navigation";

// React
import { useState } from "react";

// React Hook Form
import { FormProvider, useForm, type Resolver } from "react-hook-form";
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
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Icons
import { Pencil, Trash } from "lucide-react";

// Components
import TextField from "@/components/form/text-field";
import SelectField from "@/components/form/select-field";
import SubmitButton from "@/components/form/submit-button";
import ReferenceValuesGroup from "./reference-values-group";

export default function PracticeField({ field }: { field: LabPracticeField }) {
  const [isOpen, setIsOpen] = useState(false);

  const { name, dataType, unit, referenceValues } = field;

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
      referenceValues: field.referenceValues,
    },
  });

  const { handleSubmit } = methods;

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

            <ReferenceValuesGroup fieldId={field.id} values={referenceValues} />

            <div className="flex gap-2 pt-1">
              <SubmitButton label="Guardar" isExecuting={isExecuting} />
              <Button type="button" variant="outline" disabled={isExecuting}>
                Cancelar
              </Button>
            </div>
          </form>
        </FormProvider>
      </CollapsibleContent>
    </Collapsible>
  );
}
