export type FieldType =
  | "text"
  | "textarea"
  | "cpf"
  | "cnpj"
  | "cpfCnpj"
  | "phone"
  | "currency"
  | "date"
  | "number"
  | "email"
  | "cep"
  | "select"

export interface FieldOption {
  label: string
  value: string
}

/**
 * Descreve um campo de formulário dirigido por dados. Uma linha em
 * DocumentTemplateVersion.fieldsSchema é um array de FieldSchema — o
 * DynamicForm renderiza qualquer documento a partir disso, sem componentes
 * específicos por tipo de documento.
 */
export interface FieldSchema {
  key: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  help?: string
  options?: FieldOption[]
  minLength?: number
  maxLength?: number
  defaultValue?: string
}
