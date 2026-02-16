"use client";

// Dnd
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Shadcn
import { Item, ItemActions } from "@/components/ui/item";

// Icons
import { GripVertical } from "lucide-react";

export default function Draggable({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item
      variant="outline"
      className="grid grid-cols-3"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ItemActions>
        <GripVertical />
      </ItemActions>

      {children}
    </Item>
  );
}
