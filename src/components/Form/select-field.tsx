"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { get } from "react-hook-form";

export default function SelectField({
  name,
  label,
  disabled,
  options,
}: {
  name: string;
  label: string;
  disabled?: boolean;
  options: string[];
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, name)?.message as string | undefined;

  return (
    <Field>
      <FieldLabel htmlFor={label}>{label}</FieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {error && <FieldError errors={[{ message: error as string }]} />}
    </Field>
  );
}
