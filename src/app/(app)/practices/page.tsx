// Next
import Link from "next/link";

// Db
import { db } from "@/lib/db";

// Shadcn
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

// Phosphor
import {
  FolderSimpleStarIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react/ssr";

// Components
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";

export default async function PracticesPage() {
  const practices = await db.query.labPractice.findMany();

  return (
    <main className="w-full h-full p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prácticas</h1>
        <p className="text-muted-foreground mt-2">
          Catálogo de prácticas bioquímicas disponibles
        </p>
      </div>

      <DataTable columns={columns} data={practices} />
    </main>
  );
}
