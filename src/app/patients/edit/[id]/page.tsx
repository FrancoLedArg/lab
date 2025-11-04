import { notFound } from "next/navigation";
import { getPatientById } from "@/actions/patients";
import { EditPatientForm } from "./features/edit-form";

export default async function EditPatientPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const patientId = parseInt(id, 10);

  if (isNaN(patientId)) {
    notFound();
  }

  const result = await getPatientById({ id: patientId });

  if (!result?.data) {
    notFound();
  }

  const patient = result.data;

  return <EditPatientForm patient={patient} />;
}
