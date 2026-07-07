import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

import { CategoryIcon } from "@/components/document/category-icon"
import { cn } from "@/lib/utils"
import { getActiveCategories } from "@/modules/templates/queries/get-categories"
import { getPublishedTemplates } from "@/modules/templates/queries/get-published-templates"

export const metadata: Metadata = {
  title: "Documentos",
  description:
    "Explore todos os modelos de documentos disponíveis no DocFácil, organizados por categoria.",
}

export const revalidate = 3600

export default async function DocumentosCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams
  const [categories, templates] = await Promise.all([
    getActiveCategories(),
    getPublishedTemplates(),
  ])

  const filteredTemplates = categoria
    ? templates.filter((template) => template.category.slug === categoria)
    : templates

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Todos os documentos
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Escolha um modelo e gere seu documento em minutos.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <Link
          href="/documentos"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            !categoria
              ? "bg-primary text-primary-foreground border-primary"
              : "hover:bg-muted"
          )}
        >
          Todos
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/documentos?categoria=${category.slug}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              categoria === category.slug
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-muted"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {filteredTemplates.length === 0 ? (
        <p className="text-muted-foreground mt-16 text-center">
          Nenhum documento encontrado nessa categoria.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Link
              key={template.id}
              href={`/documentos/${template.slug}`}
              className="group bg-card hover:border-primary/40 flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md"
            >
              <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                <CategoryIcon icon={template.category.icon} className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs">{template.category.name}</p>
                <h2 className="font-semibold">{template.name}</h2>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                  {template.description}
                </p>
                <span className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  Gerar documento
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
