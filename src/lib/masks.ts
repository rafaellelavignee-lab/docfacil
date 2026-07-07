import type { FieldType } from "@/modules/templates/domain/field-schema"

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "")
}

export function formatCPF(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

export function formatCNPJ(value: string): string {
  const digits = onlyDigits(value).slice(0, 14)
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
}

export function formatCpfCnpj(value: string): string {
  const digits = onlyDigits(value)
  return digits.length > 11 ? formatCNPJ(value) : formatCPF(value)
}

export function formatCEP(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.replace(/(\d{5})(\d{1,3})$/, "$1-$2")
}

export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2")
  }
  return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}

export function formatDate(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d{1,4})$/, "$1/$2")
}

/** Formata dígitos (centavos) para o padrão de moeda brasileiro (R$ 1.234,56). */
export function formatCurrency(value: string): string {
  const digits = onlyDigits(value)
  const cents = Number(digits || "0")
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export const FIELD_FORMATTERS: Partial<Record<FieldType, (value: string) => string>> = {
  cpf: formatCPF,
  cnpj: formatCNPJ,
  cpfCnpj: formatCpfCnpj,
  cep: formatCEP,
  phone: formatPhone,
  date: formatDate,
  currency: formatCurrency,
}
