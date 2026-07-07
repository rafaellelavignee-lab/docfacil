import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Copy, Download, Pencil, Printer } from "lucide-react"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { Button } from "@/components/ui/button"
import { DocumentPreview } from "@/components/document/document-preview"
import { resolveContentSchema } from "@/modules/documents/domain/resolve-tokens"
import type { ContentSchema } from "@/modules/templates/domain/content-schema"
import { duplicateDocumentAction } from "./actions"
import { FavoriteButton } from "./favorite-button"

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const document = await container.userDocumentRepository.findById(id)
  if (!document || document.userId !== session.user.id) notFound()

  const contentSchema = document.templateVersion.contentSchema as unknown as ContentSchema
  const blocks = resolveContentSchema(
    contentSchema,
    document.data as Record<string, string>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm">{document.template.name}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{document.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <FavoriteButton id={document.id} isFavorite={document.isFavorite} />
          <Button
            variant="outline"
            render={<Link href={`/painel/documentos/${document.id}/editar`} />}
          >
            <Pencil /> Editar
          </Button>
          <form action={duplicateDocumentAction.bind(null, document.id)}>
            <Button type="submit" variant="outline">
              <Copy /> Duplicar
            </Button>
          </form>
          {document.pdfBlobUrl && (
            <Button
              variant="outline"
              render={
                <a href={document.pdfBlobUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              <Printer /> Imprimir
            </Button>
          )}
          <Button render={<a href={`/painel/documentos/${document.id}/download`} />}>
            <Download /> Baixar PDF
          </Button>
        </div>
      </div>
      <DocumentPreview blocks={blocks} />
    </div>
  )
}
