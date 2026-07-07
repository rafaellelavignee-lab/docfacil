import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { DocumentCard } from "@/components/document/document-card"

export default async function FavoritosPage() {
  const session = await auth()
  const documents = session?.user
    ? await container.userDocumentRepository.findManyByUser(session.user.id)
    : []
  const favorites = documents.filter((document) => document.isFavorite)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Favoritos</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Seus documentos marcados como favoritos, para acesso rápido.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center">
          Você ainda não favoritou nenhum documento.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((document) => (
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
