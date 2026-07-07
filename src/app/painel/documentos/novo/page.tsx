import Link from "next/link"
import { FileText } from "lucide-react"

import { CategoryIcon } from "@/components/document/category-icon"
import { getPublishedTemplates } from "@/modules/templates/queries/get-published-templates"

export default async function ChooseTemplatePage() {
  const templates = await getPublishedTemplates()

  const byCategory = new Map<
    string,
    { name: string; icon: string | null; templates: typeof templates }
  >()
  for (const template of templates) {
    const key = template.category.slug
    if (!byCategory.has(key)) {
      byCategory.set(key, {
        name: template.category.name,
        icon: template.category.icon,
        templates: [],
      })
    }
    byCategory.get(key)!.templates.push(template)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Escolha um documento</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Selecione o modelo que deseja preencher.
        </p>
      </div>

      {templates.length === 0 && (
        <p className="text-muted-foreground">Nenhum documento disponível no momento.</p>
      )}

      <div className="space-y-10">
        {Array.from(byCategory.entries()).map(([slug, category]) => (
          <section key={slug}>
            <div className="mb-3 flex items-center gap-2">
              <CategoryIcon icon={category.icon} className="text-primary size-4" />
              <h2 className="font-semibold">{category.name}</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {category.templates.map((template) => (
                <Link
                  key={template.id}
                  href={`/painel/documentos/novo/${template.slug}`}
                  className="group bg-card hover:border-primary/40 flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-md"
                >
                  <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{template.name}</p>
                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                      {template.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
