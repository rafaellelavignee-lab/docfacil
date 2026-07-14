import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CompraAvulsaRetornoPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <CheckCircle2 className="text-primary size-12" />
      <h1 className="text-2xl font-semibold tracking-tight">
        Pagamento em processamento
      </h1>
      <p className="text-muted-foreground text-sm">
        Assim que a confirmação chegar do Mercado Pago (geralmente em poucos segundos),
        seu crédito estará disponível. Volte para o documento e envie o formulário
        novamente para gerá-lo.
      </p>
      <Button render={<Link href="/painel/documentos/novo" />}>
        Voltar para os documentos
      </Button>
    </div>
  )
}
