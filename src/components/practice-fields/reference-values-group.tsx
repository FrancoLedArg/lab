"use client";

// React Hook Form
import { useFormContext, useFieldArray } from "react-hook-form";

// Shadcn
import { FieldSet, FieldLegend, FieldGroup } from "@/components/ui/field";
import { Empty } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

// Icons
import { Plus, Trash } from "lucide-react";

// Components
import TextField from "@/components/form/text-field";

export default function ReferenceValuesGroup() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "referenceValues",
  });

  return (
    <FieldSet>
      <FieldGroup className="flex flex-row justify-between items-center">
        <FieldLegend>Valores de referencia</FieldLegend>
        <Button
          variant="outline"
          onClick={() => append({ name: "Nombre", minRange: 1, maxRange: 10 })}
        >
          <Plus /> Agregar
        </Button>
      </FieldGroup>

      <FieldSet>
        {fields.length === 0 ? (
          <Empty>Hello World</Empty>
        ) : (
          fields.map((field, index) => (
            <FieldGroup
              key={field.id}
              className="grid grid-cols-2 md:grid-cols-3 gap-2"
            >
              <TextField
                name={`referenceValues.${index}.name`}
                label="Nombre"
                className="col-span-1 md:col-span-2"
              />
              <TextField
                name={`referenceValues.${index}.minRange`}
                label="Rango mínimo"
              />
              <TextField
                name={`referenceValues.${index}.maxRange`}
                label="Rango máximo"
              />
              <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash />
              </Button>
            </FieldGroup>
          ))
        )}
      </FieldSet>
    </FieldSet>
  );
}
