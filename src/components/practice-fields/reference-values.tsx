// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { deleteReferenceValues } from "@/actions/reference-values";

// Shadcn
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Icons
import { Trash } from "lucide-react";

// Components
import TextField from "@/components/form/text-field";

// Types
import type { ReferenceValues as ReferenceValuesType } from "@/lib/validation/reference-values";

export default function ReferenceValue(data: ReferenceValuesType) {
  const { execute, isExecuting } = useAction(deleteReferenceValues, {
    onSuccess: ({ data }) => {},
    onError: ({ error }) => {
      toast.error("Error al actualizar los valores de referencia.", {
        description: error.serverError as string,
      });
    },
  });

  return (
    <FieldGroup>
      <TextField name="name" label="Nombre" />
      <TextField name="minRange" label="Rango mínimo" />
      <TextField name="maxRange" label="Rango máximo" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => execute({ id: data.id })}
        disabled={isExecuting}
      >
        {isExecuting ? <Spinner /> : <Trash />}
      </Button>
    </FieldGroup>
  );
}
