"use client";

// Dnd
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    <div
      className="w-full flex gap-6 rounded-md p-6 bg-muted/25"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="flex items-center gap-2" {...listeners}>
        <GripVertical size={24} />
      </div>

      {children}
    </div>
  );
}
