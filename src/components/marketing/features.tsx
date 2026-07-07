import { Clock, FileCheck, Layers, Lock, Sparkles, Wand2 } from "lucide-react"

const FEATURES = [
  {
    icon: Clock,
    title: "Rápido",
    description: "Gere um documento completo em menos de 2 minutos, sem retrabalho.",
  },
  {
    icon: FileCheck,
    title: "Profissional",
    description:
      "PDFs com tipografia elegante, margens e numeração de escritório jurídico.",
  },
  {
    icon: Lock,
    title: "Seguro",
    description: "Criptografia, conformidade com a LGPD e backups automáticos.",
  },
  {
    icon: Layers,
    title: "Sempre à mão",
    description: "Histórico, favoritos e edição posterior de todos os seus documentos.",
  },
  {
    icon: Wand2,
    title: "Sem complicação",
    description: "Sem jargão jurídico. Campos claros, com ajuda em cada etapa.",
  },
  {
    icon: Sparkles,
    title: "Pronto para crescer",
    description: "Novos modelos de documentos são adicionados continuamente.",
  },
]

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Tudo o que você precisa, sem complicação
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Uma plataforma pensada para gerar documentos com a qualidade de um escritório
          profissional.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="flex flex-col gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <feature.icon className="size-5" />
            </div>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground text-sm text-pretty">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
