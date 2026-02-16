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
import NewPracticeButton from "@/components/practices-data-table/new-practice-button";

export default async function PracticesPage() {
  const practices = await db.query.labPractices.findMany();

  return (
    <main className="w-full h-full p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Prácticas</h1>

        <div className="flex justify-end">
          <NewPracticeButton />
        </div>
      </div>

      <div className="w-full">
        <DataTable columns={columns} data={practices} />
      </div>
    </main>
  );
}
