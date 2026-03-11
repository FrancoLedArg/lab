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

export default function ShortcutsGroup() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "shortcuts",
  });

  return (
    <FieldSet>
      <FieldGroup className="flex flex-row justify-between items-center">
        <FieldLegend>Shortcuts</FieldLegend>
        <Button
          variant="outline"
          onClick={() => append({ label: "", value: "" })}
        >
          <Plus /> Agregar
        </Button>
      </FieldGroup>

      <FieldSet>
        {fields.length === 0 ? (
          <Empty>No hay atajos definidos.</Empty>
        ) : (
          fields.map((field, index) => (
            <FieldGroup key={field.id} className="grid grid-cols-2 gap-2">
              <TextField name={`shortcuts.${index}.label`} label="Atajo" />
              <TextField name={`shortcuts.${index}.value`} label="Valor" />
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
