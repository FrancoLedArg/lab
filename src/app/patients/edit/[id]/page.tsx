import { notFound } from "next/navigation";
import { getPatientById } from "@/actions/patients";
import { Form } from "./form";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patientId = parseInt(id, 10);

  if (isNaN(patientId)) {
    notFound();
  }

  const result = await getPatientById({ id: patientId });

  if (!result?.data) {
    notFound();
  }

  const patient = result.data;

  return <Form patient={patient} />;
}
