import { z } from "zod"

import { isValidCNPJ } from "@/lib/validators/cnpj"
import { isValidCPF } from "@/lib/validators/cpf"
import type { FieldSchema } from "./field-schema"

function isValidBrDate(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return false
  const [, day, month, year] = match.map(Number) as unknown as [
    never,
    number,
    number,
    number,
  ]
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  )
}

function buildRequiredString(field: FieldSchema): z.ZodTypeAny {
  let schema = z.string()

  switch (field.type) {
    case "cpf":
      return schema.refine(isValidCPF, "CPF inválido.")
    case "cnpj":
      return schema.refine(isValidCNPJ, "CNPJ inválido.")
    case "cpfCnpj":
      return schema.refine(
        (v) => isValidCPF(v) || isValidCNPJ(v),
        "CPF ou CNPJ inválido."
      )
    case "cep":
      return schema.regex(/^\d{5}-?\d{3}$/, "CEP inválido.")
    case "phone":
      return schema.regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, "Telefone inválido.")
    case "date":
      return schema
        .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida.")
        .refine(isValidBrDate, "Data inválida.")
    case "email":
      return z.email("Informe um e-mail válido.")
    default:
      if (field.maxLength) schema = schema.max(field.maxLength)
      if (field.minLength)
        schema = schema.min(field.minLength, `Mínimo de ${field.minLength} caracteres.`)
      return schema
  }
}

/** Constrói dinamicamente um schema Zod a partir de FieldSchema[] — o mesmo
 * schema que dirige o DynamicForm. Nenhum documento novo exige código novo:
 * cadastrar campos no template já produz validação completa. */
export function buildTemplateZodSchema(fields: FieldSchema[]) {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of fields) {
    if (field.type === "select") {
      const values = (field.options ?? []).map((option) => option.value)
      if (values.length === 0) {
        shape[field.key] = z.string()
        continue
      }
      const enumSchema = z.enum(values as [string, ...string[]], {
        error: `Selecione uma opção para ${field.label}.`,
      })
      shape[field.key] = field.required
        ? enumSchema
        : z.union([z.literal(""), enumSchema])
      continue
    }

    const requiredSchema = buildRequiredString(field)

    if (field.required) {
      shape[field.key] =
        field.type === "text" || field.type === "textarea"
          ? (requiredSchema as z.ZodString).min(1, `${field.label} é obrigatório.`)
          : requiredSchema
    } else {
      shape[field.key] = z.union([z.literal(""), requiredSchema])
    }
  }

  return z.object(shape)
}

export function buildDefaultValues(fields: FieldSchema[]): Record<string, string> {
  return Object.fromEntries(fields.map((field) => [field.key, field.defaultValue ?? ""]))
}
