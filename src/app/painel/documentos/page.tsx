import Link from "next/link"
import { Plus } from "lucide-react"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { Button } from "@/components/ui/button"
import { DocumentCard } from "@/components/document/document-card"

export default async function MeusDocumentosPage() {
  const session = await auth()
  const documents = session?.user
    ? await container.userDocumentRepository.findManyByUser(session.user.id)
    : []

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Meus documentos</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Todos os documentos que você já gerou.
          </p>
        </div>
        <Button render={<Link href="/painel/documentos/novo" />}>
          <Plus /> Novo documento
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center">
          Você ainda não gerou nenhum documento.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={{
                id: document.id,
                title: document.title,
                templateName: document.template.name,
                status: document.status,
                isFavorite: document.isFavorite,
                updatedAt: document.updatedAt,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
