"use client"

import { useState } from "react"
import { toast } from "sonner"

import { DynamicForm } from "@/components/forms/dynamic-form"
import type { FieldSchema } from "@/modules/templates/domain/field-schema"
import { updateDocumentAction } from "./actions"

export function EditDocumentForm({
  documentId,
  fields,
  defaultValues,
}: {
  documentId: string
  fields: FieldSchema[]
  defaultValues: Record<string, string>
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: Record<string, string>) {
    setIsSubmitting(true)
    const result = await updateDocumentAction(documentId, data)
    if (result?.error) {
      toast.error(result.error)
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicForm
      fields={fields}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Salvar e gerar novo PDF"
    />
  )
}
