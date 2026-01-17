import Link from "next/link";
import { getAllPatients } from "@/actions/patients";
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
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Users } from "lucide-react";

export default async function PatientsPage() {
  const res = await getAllPatients();

  if (!res || !res.data) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {res.serverError || "Error al cargar los pacientes"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { data } = res;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Pacientes
          </h1>
          <p className="text-muted-foreground mt-2">
            Listado completo de todos los pacientes registrados
          </p>
        </div>
        <Button asChild>
          <Link href="/patients/create">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Paciente
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Pacientes</CardTitle>
          <CardDescription>
            {data.length} {data.length === 1 ? "paciente registrado" : "pacientes registrados"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No se encontraron pacientes</p>
              <p className="text-sm mb-4">Comienza creando tu primer paciente</p>
              <Button asChild>
                <Link href="/patients/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Paciente
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.firstName}</TableCell>
                    <TableCell>{patient.lastName}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      {patient.createdAt.toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/patients/edit/${patient.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar paciente</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
