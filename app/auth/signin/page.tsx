"use client";

// Features
import { ChildForm } from "./features/child-form";
import { formOptions } from "./features/form-options";
import { useAppForm } from "@/hooks/form";

// Actions
import { signinAction } from "./actions/signin";

export default function Page() {
  const form = useAppForm({
    ...formOptions,

    onSubmit: async ({ value }) => {
      const res = await signinAction(value);

      if (res.success) {
        console.log("Success:", res);
      } else {
        console.log("Error:", res);
      }
    },
  });
  return <ChildForm form={form} title='Iniciar sesión' />;
}
