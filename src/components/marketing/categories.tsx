import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CategoryIcon } from "@/components/document/category-icon"

interface CategoryItem {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  _count: { templates: number }
}

export function Categories({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="bg-muted/30 border-y">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Documentos para cada momento
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Organizados por categoria, para você encontrar o modelo certo em segundos.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/documentos?categoria=${category.slug}`}
              className="group bg-card hover:border-primary/40 flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md"
            >
              <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                <CategoryIcon icon={category.icon} className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {category.description}
                </p>
                <span className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  {category._count.templates}{" "}
                  {category._count.templates === 1 ? "documento" : "documentos"}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
