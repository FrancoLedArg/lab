"use client";

// Next
import { useRouter } from "next/navigation";

// React
import { useState } from "react";

// Shadcn
import {
  Item,
  ItemTitle,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item";

// Components
import EditFieldForm, {
  type EditFieldFormField,
} from "@/components/practice-fields/edit-field-form";

export type PracticeFieldProps = EditFieldFormField;

export default function PracticeField({ data }: { data: PracticeFieldProps }) {
  const { name, dataType, unit } = data;
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Item
      className="w-full flex flex-row justify-between items-center"
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isEditing ? (
        <div className="w-full">
          <EditFieldForm
            field={data}
            onSuccess={() => {
              setIsEditing(false);
              router.refresh();
            }}
            onCancel={() => setIsEditing(false)}
          />
        </div>
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
