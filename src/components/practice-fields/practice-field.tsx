"use client";

// React
import { useRef, useState } from "react";

// Dnd
import { useSortable } from "@dnd-kit/react/sortable";

// Types
import type { LabPracticeField } from "@/lib/validation/lab-practice-fields";

// Shadcn
import {
  Item,
  ItemHeader,
  ItemActions,
  ItemTitle,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Icons
import { GripVertical, Pencil, Trash } from "lucide-react";

// Components
import PracticeFieldForm from "./practice-field-form";

export default function PracticeField({
  id,
  index,
  field,
}: {
  id: number;
  index: number;
  field: LabPracticeField;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);

  const { isDragging } = useSortable({
    id,
    index,
    element,
    handle: handleRef,
  });

  const { name, dataType, unit } = field;

  return (
    <Item
      ref={setElement}
      variant="muted"
      className="w-full grid grid-cols-[auto_1fr_auto] items-start gap-4"
      data-shadow={isDragging || undefined}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full flex flex-col gap-4 col-span-full">
        <ItemHeader className="w-full flex flex-row justify-between items-center gap-6">
          <ItemActions>
            <Button variant="ghost" size="icon" ref={handleRef}>
              <GripVertical />
            </Button>
          </ItemActions>

          <ItemContent>
            <ItemTitle>{name}</ItemTitle>
            <ItemDescription>
              {dataType} - {unit}
            </ItemDescription>
          </ItemContent>

          <ItemActions>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil />
              </Button>
            </CollapsibleTrigger>

            <Button variant="ghost" size="icon">
              <Trash />
            </Button>
          </ItemActions>
        </ItemHeader>

        <CollapsibleContent className="w-full flex flex-col gap-4">
          <Separator />
          <PracticeFieldForm field={field} />
        </CollapsibleContent>
      </Collapsible>
    </Item>
  );
}
