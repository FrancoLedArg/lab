"use client";

// Next
import { useRouter } from "next/navigation";

// React
import { useState } from "react";

// Next Safe Action
import { useAction } from "next-safe-action/hooks";
import { createLabPracticeField } from "@/actions/lab-practice-fields";
import { updateFieldsHierarchy } from "@/actions/lab-practices";

// Types
import { LabPracticeField } from "@/lib/validation/lab-practice-fields";

// Dnd
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Shadcn
import { ItemGroup } from "@/components/ui/item";
import { toast } from "sonner";

// Components
import PracticeField from "@/components/practice-fields/practice-field";
import SafeActionButton from "../safe-action-button";

export default function PracticeFieldsGroup({
  labPracticeId,
  labPracticeFields,
}: {
  labPracticeId: number;
  labPracticeFields: LabPracticeField[];
}) {
  const router = useRouter();

  const [items, setItems] = useState(
    labPracticeFields.map((field) => field.id),
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { execute } = useAction(updateFieldsHierarchy, {
    onSuccess: () => {
      toast.success("Jerarquía de los campos actualizada.");
      router.refresh();
    },
    onError: ({ error }) => {
      toast.error("Error al actualizar la jerarquía de los campos.", {
        description: error.serverError,
      });
    },
  });

  const handleDragEnd = (e: any) => {
    const { active, over } = e;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
      execute({
        id: labPracticeId,
        labPracticeFieldIds: items.map((id) => ({ id })),
      });
    }
  };
  return (
    <ItemGroup className="flex flex-col justify-center items-center gap-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {labPracticeFields.map((field) => (
            <PracticeField key={field.id} id={field.id} data={field} />
          ))}
        </SortableContext>
      </DndContext>

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
