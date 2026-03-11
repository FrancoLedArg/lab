"use client";

import { useFormContext } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { get } from "react-hook-form";
import { cn } from "@/lib/utils";

export default function NumberField({
  name,
  label,
  disabled,
  className,
}: {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message as string | undefined;

  return (
    <Field className={cn(className)}>
      <FieldLabel htmlFor={label}>{label}</FieldLabel>
      <Input
        type="text"
        id={name}
        placeholder={label}
        autoComplete="off"
        disabled={disabled}
        {...register(name, {
          onChange: async () => {
            await trigger(name);
          },
          setValueAs: (v: string) => (v === "" ? null : Number(v)),
        })}
      />
      {error && <FieldError errors={[{ message: error as string }]} />}
    </Field>
  );
}

