"use client";

// React
import { useState } from "react";

// Shadcn
import {
  ItemActions,
  ItemTitle,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item";

// Components
import Draggable from "@/components/dnd/draggable";
import EditFieldForm, {
  type EditFieldFormField,
} from "@/components/practice-fields/edit-field-form";

export type PracticeFieldProps = EditFieldFormField;

export default function PracticeField({
  id,
  data,
}: {
  id: number;
  data: PracticeFieldProps;
}) {
  const { name, dataType, unit } = data;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Draggable
      id={id.toString()}
      variant="muted"
      className="w-full flex flex-row justify-between items-center gap-6"
    >
      <ItemContent></ItemContent>
    </Draggable>
  );
}
