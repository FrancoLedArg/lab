"use client";

// React Hook Form
import { useFormContext, useFieldArray } from "react-hook-form";

// Shadcn
import { Empty } from "@/components/ui/empty";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

// Icons
import { Trash } from "lucide-react";

// Components
import TextField from "@/components/form/text-field";

export default function ReferenceValue() {
  const { control } = useFormContext();
  const { fields, remove } = useFieldArray({
    control,
    name: "referenceValues",
  });

  if (fields.length === 0) {
    return <Empty>Hello World</Empty>;
  }

  return (
    <FieldSet>
      {fields.map((field, index) => (
        <FieldGroup key={field.id}>
          <TextField name="name" label="Nombre" />
          <TextField name="minRange" label="Rango mínimo" />
          <TextField name="maxRange" label="Rango máximo" />
          <Button variant="ghost" size="icon" onClick={() => remove(index)}>
            <Trash />
          </Button>
        </FieldGroup>
      ))}
    </FieldSet>
  );
}
