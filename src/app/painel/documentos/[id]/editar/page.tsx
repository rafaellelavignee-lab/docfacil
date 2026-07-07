import { notFound, redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import type { FieldSchema } from "@/modules/templates/domain/field-schema"
import { EditDocumentForm } from "./edit-document-form"

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const document = await container.userDocumentRepository.findById(id)
  if (!document || document.userId !== session.user.id) notFound()

  const fields = document.templateVersion.fieldsSchema as unknown as FieldSchema[]

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <p className="text-primary text-sm font-medium">{document.template.name}</p>
        <h1 className="text-2xl font-semibold tracking-tight">Editar documento</h1>
      </div>
      <EditDocumentForm
        documentId={document.id}
        fields={fields}
        defaultValues={document.data as Record<string, string>}
      />
    </div>
  )
}
