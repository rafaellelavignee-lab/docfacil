import Link from "next/link"
import { Download, FileText, Plus, Star } from "lucide-react"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { prisma } from "@/lib/prisma"
import { getUserActivePlan } from "@/modules/billing/queries/get-user-plan"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DocumentCard } from "@/components/document/document-card"

export default async function PainelPage() {
  const session = await auth()
  if (!session?.user) return null

  const [documents, downloadsCount, plan] = await Promise.all([
    container.userDocumentRepository.findManyByUser(session.user.id),
    prisma.documentDownloadLog.count({ where: { userId: session.user.id } }),
    getUserActivePlan(session.user.id),
  ])

  const favoritesCount = documents.filter((document) => document.isFavorite).length
  const recentDocuments = documents.slice(0, 6)

  const stats = [
    { label: "Documentos criados", value: documents.length, icon: FileText },
    { label: "Favoritos", value: favoritesCount, icon: Star },
    { label: "Downloads", value: downloadsCount, icon: Download },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Olá, {session.user.name?.split(" ")[0] ?? "por aqui"}!
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Plano atual: <span className="text-foreground font-medium">{plan.name}</span>
          </p>
        </div>
        <Button render={<Link href="/painel/documentos/novo" />}>
          <Plus /> Novo documento
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Documentos recentes</h2>
          {documents.length > 0 && (
            <Link
              href="/painel/documentos"
              className="text-primary text-sm font-medium hover:underline"
            >
              Ver todos
            </Link>
          )}
        </div>

        {recentDocuments.length === 0 ? (
          <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center">
            Você ainda não gerou nenhum documento.{" "}
            <Link href="/painel/documentos/novo" className="text-primary hover:underline">
              Gerar o primeiro
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentDocuments.map((document) => (
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
    </div>
  )
}
