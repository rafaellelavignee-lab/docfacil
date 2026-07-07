"use client"

import type { ControllerRenderProps } from "react-hook-form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFormField } from "@/components/ui/form"
import { FIELD_FORMATTERS } from "@/lib/masks"
import type { FieldSchema } from "@/modules/templates/domain/field-schema"

const INPUT_MODE_BY_TYPE: Partial<
  Record<FieldSchema["type"], "numeric" | "tel" | "email">
> = {
  cpf: "numeric",
  cnpj: "numeric",
  cpfCnpj: "numeric",
  cep: "numeric",
  phone: "tel",
  date: "numeric",
  currency: "numeric",
  number: "numeric",
  email: "email",
}

interface FieldRendererProps {
  fieldSchema: FieldSchema
  field: ControllerRenderProps<Record<string, string>, string>
}

export function FieldRenderer({ fieldSchema, field }: FieldRendererProps) {
  const { formItemId, formDescriptionId, formMessageId, error } = useFormField()
  const ariaProps = {
    id: formItemId,
    "aria-describedby": !error
      ? formDescriptionId
      : `${formDescriptionId} ${formMessageId}`,
    "aria-invalid": !!error,
  }

  if (fieldSchema.type === "textarea") {
    return (
      <Textarea
        placeholder={fieldSchema.placeholder}
        rows={4}
        {...ariaProps}
        {...field}
      />
    )
  }

  if (fieldSchema.type === "select") {
    return (
      <Select value={field.value} onValueChange={field.onChange} name={field.name}>
        <SelectTrigger className="w-full" {...ariaProps}>
          <SelectValue placeholder={fieldSchema.placeholder ?? "Selecione"} />
        </SelectTrigger>
        <SelectContent>
          {fieldSchema.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const formatter = FIELD_FORMATTERS[fieldSchema.type]

  return (
    <Input
      placeholder={fieldSchema.placeholder}
      inputMode={INPUT_MODE_BY_TYPE[fieldSchema.type]}
      type={fieldSchema.type === "email" ? "email" : "text"}
      maxLength={fieldSchema.maxLength}
      {...ariaProps}
      {...field}
      onChange={(event) => {
        const rawValue = event.target.value
        field.onChange(formatter ? formatter(rawValue) : rawValue)
      }}
    />
  )
}
