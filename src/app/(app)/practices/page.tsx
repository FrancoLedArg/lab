// Db
import { db } from "@/lib/db";
import { labPractice } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

// Shadcn
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PracticesPage() {
  const practices = await db.query.labPractice.findMany();

  if (!practices || practices.length === 0) {
    return (
      <main>
        <Empty>
          <EmptyTitle>No se encontraron prácticas</EmptyTitle>
          <EmptyDescription>
            No se encontraron prácticas registradas
          </EmptyDescription>
        </Empty>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prácticas</h1>
        <p className="text-muted-foreground mt-2">
          Catálogo de prácticas bioquímicas disponibles
        </p>
      </div>
    </main>
  );
}
