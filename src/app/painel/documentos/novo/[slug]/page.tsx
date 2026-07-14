import { notFound } from "next/navigation"

import { getPublishedTemplateBySlug } from "@/modules/templates/queries/get-template-by-slug"
import { getDocumentPriceCents } from "@/modules/billing/use-cases/purchase-document-credit"
import type { FieldSchema } from "@/modules/templates/domain/field-schema"
import { NewDocumentForm } from "./new-document-form"

export default async function NewDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const template = await getPublishedTemplateBySlug(slug)
  if (!template?.activeVersion) notFound()

  const fields = template.activeVersion.fieldsSchema as unknown as FieldSchema[]

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <p className="text-primary text-sm font-medium">{template.category.name}</p>
        <h1 className="text-2xl font-semibold tracking-tight">{template.name}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{template.description}</p>
      </div>
      <NewDocumentForm
        templateSlug={slug}
        fields={fields}
        documentPriceCents={getDocumentPriceCents()}
      />
    </div>
  )
}
