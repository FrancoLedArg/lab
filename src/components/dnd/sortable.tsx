"use client";

// React
import { useRef, useState } from "react";

// Dnd
import { useSortable } from "@dnd-kit/react/sortable";

// Shadcn
import { Item, ItemActions } from "@/components/ui/item";
import { Button } from "@/components/ui/button";

// Icons
import { GripVertical } from "lucide-react";

export default function Sortable({
  id,
  index,
  children,
}: {
  id: number;
  index: number;
  children: React.ReactNode;
}) {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({ id, index, element, handle: handleRef });

  return (
    <Item
      ref={setElement}
      variant="muted"
      className="w-full grid grid-cols-[auto_1fr_auto] items-start gap-4"
      data-shadow={isDragging || undefined}
    >
      <ItemActions>
        <Button variant="ghost" size="icon" ref={handleRef}>
          <GripVertical />
        </Button>
      </ItemActions>

      {children}
    </Item>
  );
}
