"use client";

// Next
import { useRouter } from "next/navigation";

// React
import { useState } from "react";

// Dnd
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Shadcn
import {
  Item,
  ItemActions,
  ItemTitle,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item";

// Components
import EditFieldForm, {
  type EditFieldFormField,
} from "@/components/practice-fields/edit-field-form";

// Icons
import { GripVertical } from "lucide-react";

export type PracticeFieldProps = EditFieldFormField;

export default function PracticeField({
  id,
  data,
}: {
  id: number;
  data: PracticeFieldProps;
}) {
  const { name, dataType, unit } = data;
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Dnd
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item
      variant="muted"
      className="w-full flex flex-row justify-between items-center gap-6"
      onClick={() => !isEditing && setIsEditing(true)}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <ItemActions>
        <GripVertical
          size={16}
          className="text-muted-foreground"
          {...listeners}
        />
      </ItemActions>

      {isEditing ? (
        <ItemContent className="w-full">
          <EditFieldForm
            field={data}
            onSuccess={() => {
              setIsEditing(false);
              router.refresh();
            }}
            onCancel={() => setIsEditing(false)}
          />
        </ItemContent>
      ) : (
        <ItemContent className="w-full flex flex-col gap-1">
          <ItemTitle className="text-lg">{name}</ItemTitle>
          <ItemDescription className="flex flex-row gap-1">
            <span className="px-2 py-1 bg-muted rounded-md">{dataType}</span>
            <span className="px-2 py-1 bg-muted rounded-md">{unit}</span>
          </ItemDescription>
        </ItemContent>
      )}
    </Item>
  );
}
