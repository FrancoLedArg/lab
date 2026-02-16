// Shadcn
import {
  Item,
  ItemHeader,
  ItemTitle,
  ItemContent,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";

// Icons
import { PencilIcon, TrashIcon } from "lucide-react";

interface PracticeFieldProps {
  name: string;
  dataType: string;
  unit: string;
}

export default function PracticeField({
  name,
  dataType,
  unit,
}: PracticeFieldProps) {
  return (
    <Item>
      <ItemHeader>
        <ItemTitle>{name}</ItemTitle>
      </ItemHeader>

      <ItemContent>
        <ItemDescription>
          {dataType} {unit}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <Button variant="ghost" size="icon">
          <PencilIcon />
        </Button>

        <Button variant="ghost" size="icon">
          <TrashIcon />
        </Button>
      </ItemActions>
    </Item>
  );
}
