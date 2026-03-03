// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createReferenceValues } from "@/actions/reference-values";

// Shadcn
import { FieldSet, FieldLegend, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Icons
import { Plus } from "lucide-react";

// Components
import ReferenceValues from "./reference-values";

// Types
import type { ReferenceValues as ReferenceValuesType } from "@/lib/validation/reference-values";

export default function ReferenceValuesGroup({
  fieldId,
  values,
}: {
  fieldId: number;
  values: ReferenceValuesType[];
}) {
  const { execute, isExecuting } = useAction(createReferenceValues, {
    onSuccess: ({ data }) => {},
    onError: ({ error }) => {
      toast.error("Error al actualizar los valores de referencia.", {
        description: error.serverError as string,
      });
    },
  });

  return (
    <FieldSet>
      <FieldGroup className="flex flex-row justify-between items-center">
        <FieldLegend>Valores de referencia</FieldLegend>
        <Button
          variant="outline"
          onClick={() => execute({ labPracticeFieldId: fieldId })}
          disabled={isExecuting}
        >
          {isExecuting ? (
            <Spinner />
          ) : (
            <>
              <Plus /> Agregar
            </>
          )}
        </Button>
      </FieldGroup>
      <FieldGroup></FieldGroup>
    </FieldSet>
  );
}
