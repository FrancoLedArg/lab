"use client";

// React
import { useState } from "react";

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
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

// Icons
import { FlaskConicalOff } from "lucide-react";

export default function Sortable({
  data,
  children,
}: {
  data: any[];
  children: React.ReactNode;
}) {
  const [items, setItems] = useState(data.map((field) => field.id));
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (e: any) => {
    const { active, over } = e;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {data.length > 0 ? (
          children
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FlaskConicalOff />
              </EmptyMedia>
              <EmptyTitle>No hay items disponibles</EmptyTitle>
              <EmptyDescription>Aun no creaste ningun item.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </SortableContext>
    </DndContext>
  );
}
