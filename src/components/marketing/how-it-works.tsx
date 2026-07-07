import { FileEdit, FileText, Download } from "lucide-react"

const STEPS = [
  {
    icon: FileText,
    title: "Escolha o documento",
    description: "Selecione entre dezenas de modelos organizados por categoria.",
  },
  {
    icon: FileEdit,
    title: "Preencha o formulário",
    description: "Campos simples, com máscaras, ajuda e validação — sem termos técnicos.",
  },
  {
    icon: Download,
    title: "Baixe e use",
    description: "Visualize, baixe o PDF, imprima ou salve para editar depois.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Como funciona
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Três passos entre a ideia e o documento pronto.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <div key={step.title} className="relative text-center">
            <div className="bg-primary text-primary-foreground mx-auto flex size-12 items-center justify-center rounded-full text-lg font-semibold">
              {index + 1}
            </div>
            <div className="mt-4 flex justify-center">
              <step.icon className="text-muted-foreground size-6" />
            </div>
            <h3 className="mt-3 font-semibold">{step.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm text-pretty">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
