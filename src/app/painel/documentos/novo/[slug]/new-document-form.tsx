"use client"

import { useState } from "react"
import { toast } from "sonner"

import { DynamicForm } from "@/components/forms/dynamic-form"
import type { FieldSchema } from "@/modules/templates/domain/field-schema"
import { createDocumentAction } from "./actions"

export function NewDocumentForm({
  templateSlug,
  fields,
}: {
  templateSlug: string
  fields: FieldSchema[]
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data: Record<string, string>) {
    setIsSubmitting(true)
    const result = await createDocumentAction(templateSlug, data)
    if (result?.error) {
      toast.error(result.error)
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicForm
      fields={fields}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Gerar documento"
    />
  )
}
