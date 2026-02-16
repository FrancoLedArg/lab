// Next
import { notFound } from "next/navigation";

// Db
import { db } from "@/lib/db";
import { labPractices, labPracticeFields } from "@/lib/db/schema/index";
import { eq, asc } from "drizzle-orm";

// Shadcn
import {
  ItemHeader,
  ItemTitle,
  ItemContent,
  ItemDescription,
} from "@/components/ui/item";

// Components
import CreateFieldButton from "@/components/practice-fields/create-field-button";
import Sortable from "@/components/sortable";
import Draggable from "@/components/draggable";
import PracticeField from "@/components/practice-fields/practice-field";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const practice = await db.query.labPractices.findFirst({
    where: eq(labPractices.id, Number(id)),
    with: {
      labPracticeFields: {
        orderBy: [asc(labPracticeFields.hierarchy)],
      },
    },
  });

  if (!practice) {
    return notFound();
  }

  return (
    <main className="w-full h-full p-6 flex flex-col gap-6">
      <div className="flex gap-6">
        <h1 className="text-3xl font-bold tracking-tight text-muted-foreground">
          {practice.code ? practice.code : "Null"}
        </h1>
        <h1 className="text-3xl font-bold tracking-tight">{practice.name}</h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full flex justify-between items-center gap-6">
          <p>Lista de Campos</p>

          <CreateFieldButton
            data={{ labPracticeId: Number(id), hierarchy: 0 }}
          />
        </div>

        <Sortable data={practice.labPracticeFields}>
          {practice.labPracticeFields.map((field) => (
            <Draggable key={field.id} id={field.id}>
              <PracticeField
                name={field.name}
                dataType={field.dataType}
                unit={field.unit}
              />
            </Draggable>
          ))}
        </Sortable>
      </div>
    </main>
  );
}
