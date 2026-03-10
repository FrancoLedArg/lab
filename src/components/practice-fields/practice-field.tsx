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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

// Icons
import { Ellipsis, GripVertical, Pencil, Trash } from "lucide-react";

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
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full flex flex-col gap-4 col-span-full"
      >
        <ItemHeader className="w-full flex flex-row justify-between items-center gap-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <CollapsibleTrigger asChild>
                  <DropdownMenuItem>
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                </CollapsibleTrigger>
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
