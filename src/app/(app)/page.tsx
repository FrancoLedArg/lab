import { getInformesByDay } from "@/actions/informes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileTextIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Resetear horas para comparar solo fechas
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );

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
  const result = await getInformesByDay();

  if (!result || !result.data) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {result?.serverError || "Error al cargar los informes"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const informesByDay = result.data;

  if (informesByDay.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5" />
              Informes
            </CardTitle>
            <CardDescription>No hay informes registrados aún</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Informes por Día</h1>
        <p className="text-muted-foreground mt-2">
          Listado de informes agrupados por fecha de creación
        </p>
      </div>

      <div className="space-y-6">
        {informesByDay.map(({ date, informes, count }) => (
          <Card key={date} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-xl capitalize">
                    {formatDate(date)}
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {count} {count === 1 ? "informe" : "informes"}
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
                {informes.map((informe) => {
                  // Tomar la primera orden médica del informe (o la única si es 1:1)
                  const medicalOrder = informe.medicalOrders?.[0];
                  if (!medicalOrder) return null;

                  const { patient, orderPractices, authorizations, doctorName, orderDate } = medicalOrder;
                  const practicesCount = orderPractices.length;
                  const hasAuthorization = authorizations.length > 0;
                  const authorizationStatus = hasAuthorization
                    ? authorizations[0].status
                    : null;

                  return (
                    <Link
                      key={informe.id}
                      href={`/informes/${informe.id}`}
                      className="group"
                    >
                      <Card className="transition-all hover:shadow-md hover:border-primary/50 h-full">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Número del informe grande a la izquierda */}
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary font-bold text-2xl group-hover:bg-primary/20 transition-colors">
                                {informe.id}
                              </div>
                            </div>
                            {/* Información del informe */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                {patient.firstName} {patient.lastName}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {patient.phone}
                              </p>
                              {doctorName && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Dr/a. {doctorName}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">
                                  {practicesCount}{" "}
                                  {practicesCount === 1
                                    ? "práctica"
                                    : "prácticas"}
                                </Badge>
                                {authorizationStatus && (
                                  <Badge
                                    variant={
                                      authorizationStatus === "authorized"
                                        ? "default"
                                        : authorizationStatus ===
                                            "partially_authorized"
                                          ? "secondary"
                                          : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {authorizationStatus === "authorized"
                                      ? "Autorizado"
                                      : authorizationStatus ===
                                          "partially_authorized"
                                        ? "Parcial"
                                        : "Pendiente"}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Orden: {medicalOrder.orderNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {orderDate.toLocaleDateString("es-AR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}{" "}
                                {orderDate.toLocaleTimeString("es-AR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
