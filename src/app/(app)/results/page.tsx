import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "@phosphor-icons/react/ssr";

export default async function ResultsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Resultados
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestión de resultados de laboratorio
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resultados de Laboratorio</CardTitle>
          <CardDescription>
            Esta sección estará disponible próximamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Funcionalidad en desarrollo</p>
            <p className="text-sm">
              La gestión de resultados estará disponible en una próxima
              actualización
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
