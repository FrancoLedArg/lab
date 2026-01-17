import { getAllPractices } from "@/actions/practices";
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
  const res = await getAllPractices();

  if (!res || !res.data) {
    return (
      <div className="w-full max-w-7xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {res.serverError || "Failed to load practices"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { data } = res;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prácticas</h1>
        <p className="text-muted-foreground mt-2">
          Catálogo de prácticas bioquímicas disponibles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Prácticas</CardTitle>
          <CardDescription>
            {data.length} {data.length === 1 ? "práctica registrada" : "prácticas registradas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No se encontraron prácticas
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((practice) => (
                  <TableRow key={practice.id}>
                    <TableCell className="font-medium">{practice.code}</TableCell>
                    <TableCell>{practice.name}</TableCell>
                    <TableCell>{practice.method}</TableCell>
                    <TableCell>
                      {practice.createdAt.toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
