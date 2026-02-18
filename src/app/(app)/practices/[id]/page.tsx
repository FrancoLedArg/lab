// Next
import { notFound } from "next/navigation";

// Db
import { db } from "@/lib/db";
import { labPractices, labPracticeFields } from "@/lib/db/schema/index";
import { eq, asc } from "drizzle-orm";

// Components
import PracticeFieldsGroup from "@/components/practice-fields/practice-fields-group";

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

      <PracticeFieldsGroup
        labPracticeId={practice.id}
        labPracticeFields={practice.labPracticeFields}
      />
    </main>
  );
}
