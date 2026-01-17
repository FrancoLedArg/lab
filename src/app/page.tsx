import { getPatientsByDay } from "@/actions/patients";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Resetear horas para comparar solo fechas
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return "Hoy";
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return "Ayer";
  } else {
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export default async function HomePage() {
  const result = await getPatientsByDay();

  if (!result || !result.data) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {result?.serverError || "Error al cargar los pacientes"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const patientsByDay = result.data;

  if (patientsByDay.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pacientes
            </CardTitle>
            <CardDescription>
              No hay pacientes registrados aún
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pacientes por Día</h1>
        <p className="text-muted-foreground mt-2">
          Listado de pacientes agrupados por fecha de registro
        </p>
      </div>

      <div className="space-y-6">
        {patientsByDay.map(({ date, patients, count }) => (
          <Card key={date} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-xl capitalize">
                    {formatDate(date)}
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {count} {count === 1 ? "paciente" : "pacientes"}
                </Badge>
              </div>
              <CardDescription>
                {new Date(date).toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {patients.map((patient, index) => (
                  <Link
                    key={patient.id}
                    href={`/patients/edit/${patient.id}`}
                    className="group"
                  >
                    <Card className="transition-all hover:shadow-md hover:border-primary/50 h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Número del paciente grande a la izquierda */}
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary font-bold text-2xl group-hover:bg-primary/20 transition-colors">
                              {patient.id}
                            </div>
                          </div>
                          {/* Información del paciente */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Tel: {patient.phone}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Registrado: {patient.createdAt.toLocaleTimeString("es-AR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
