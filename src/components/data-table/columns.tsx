"use client";

// Next
import Link from "next/link";

// Tanstack
import { ColumnDef } from "@tanstack/react-table";

// Shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Phosphor
import { ArrowUpRight } from "lucide-react";

interface LabPracticeRow {
  id: number;
  code: number | null;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const columns: ColumnDef<LabPracticeRow>[] = [
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
    cell: ({ row }) => {
      const raw = row.original.createdAt;
      const date = raw instanceof Date ? raw : new Date(raw as string);
      const d = date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const t = date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div>
          {d} {t}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Fecha de actualización",
    cell: ({ row }) => {
      const raw = row.original.updatedAt;
      const date = raw instanceof Date ? raw : new Date(raw as string);
      const d = date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const t = date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div>
          {d} {t}
        </div>
      );
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      console.log(row.original);

      return (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/practices/${row.original.id}`}>
            <ArrowUpRight />
          </Link>
        </Button>
      );
    },
  },
];
