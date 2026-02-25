"use client";

// Next
import { useRouter } from "next/navigation";

// React
import { useRef, useEffect } from "react";

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
  const pendingPayloadRef = useRef<{
    id: number;
    labPracticeFieldIds: { id: number }[];
  } | null>(null);

  const router = useRouter();

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

  const DEBOUNCE_MS = 400;

  const [debouncedSave, cancelDebounce] = useDebouncedCallback(
    (payload: { id: number; labPracticeFieldIds: { id: number }[] }) => {
      execute(payload);
      pendingPayloadRef.current = null;
    },
    DEBOUNCE_MS,
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
      <Sortable array={labPracticeFields.map((field) => field.id)}>
        {labPracticeFields.map((field) => (
          <PracticeField key={field.id} id={field.id} data={field} />
        ))}
      </Sortable>

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
