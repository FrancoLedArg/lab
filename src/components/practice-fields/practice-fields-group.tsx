"use client";

// React
import { useRef, useState, useEffect } from "react";

// Dnd
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

// Hooks
import { useDebouncedCallback } from "@/hooks/use-debounce";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createLabPracticeField } from "@/actions/lab-practice-fields";
import { updateFieldsHierarchy } from "@/actions/lab-practices";

// Types
import { LabPracticeField } from "@/lib/validation/lab-practice-fields";

// Shadcn
import { ItemGroup } from "@/components/ui/item";
import { toast } from "sonner";

// Components
import Sortable from "@/components/dnd/sortable";
import PracticeField from "@/components/practice-fields/practice-field";
import SafeActionButton from "../safe-action-button";

export default function PracticeFieldsGroup({
  labPracticeId,
  labPracticeFields,
}: {
  labPracticeId: number;
  labPracticeFields: LabPracticeField[];
}) {
  const [items, setItems] = useState(labPracticeFields);

  const pendingPayloadRef = useRef<{
    id: number;
    labPracticeFieldIds: { id: number }[];
  } | null>(null);

  const { execute } = useAction(updateFieldsHierarchy, {
    onSuccess: () => {
      toast.success("Jerarquía de los campos actualizada.");
    },
    onError: ({ error }) => {
      toast.error("Error al actualizar la jerarquía de los campos.", {
        description: error.serverError,
      });
    },
  });

  const [debouncedSave, cancelDebounce] = useDebouncedCallback(
    (payload: { id: number; labPracticeFieldIds: { id: number }[] }) => {
      execute(payload);
      pendingPayloadRef.current = null;
    },
    200,
  );

  const flushPendingSave = () => {
    cancelDebounce();
    if (pendingPayloadRef.current) {
      execute(pendingPayloadRef.current);
      pendingPayloadRef.current = null;
    }
  };

  useEffect(() => {
    return () => flushPendingSave();
  }, []);

  return (
    <ItemGroup className="flex flex-col justify-center items-center gap-6">
      <DragDropProvider
        onDragEnd={(event) => {
          const newArray = move(items, event);

          setItems(newArray);
          const payload = {
            id: labPracticeId,
            labPracticeFieldIds: newArray.map((field) => ({
              id: field.id,
            })),
          };
          debouncedSave(payload);
        }}
      >
        {labPracticeFields.map((field, index) => (
          <Sortable key={field.id} id={field.id} index={index}>
            <PracticeField field={field} />
          </Sortable>
        ))}
      </DragDropProvider>

      <SafeActionButton
        safeAction={createLabPracticeField}
        input={{
          labPracticeId: labPracticeId,
          hierarchy: labPracticeFields.length + 1,
        }}
      >
        Nuevo Campo
      </SafeActionButton>
    </ItemGroup>
  );
}
