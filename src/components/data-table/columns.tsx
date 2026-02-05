"use client";

// Tanstack
import { ColumnDef } from "@tanstack/react-table";

// Db – use schema row type so columns match query result (e.g. description: string | null)
import { labPractice } from "@/lib/db/schema";

type LabPracticeRow = typeof labPractice.$inferSelect;

export const columns: ColumnDef<LabPracticeRow>[] = [
  {
    header: "Código",
    accessorKey: "code",
  },
  {
    header: "Nombre",
    accessorKey: "name",
  },
  {
    header: "Descripción",
    accessorKey: "description",
  },
  {
    header: "Fecha de creación",
    accessorKey: "createdAt",
  },
  {
    header: "Fecha de actualización",
    accessorKey: "updatedAt",
  },
];
