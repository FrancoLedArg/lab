"use client";

import type { ComponentProps } from "react";

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
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ComponentProps<typeof Item> & { id: string | number }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Item
      ref={setNodeRef}
      style={style}
      className={className}
      variant={variant}
      size={size}
      asChild={asChild}
      {...attributes}
      {...props}
    >
      <ItemActions>
        <GripVertical size={24} {...listeners} />
      </ItemActions>

      {children}
    </Item>
  );
}
