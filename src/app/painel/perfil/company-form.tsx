"use client"

import { useActionState, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCNPJ } from "@/lib/masks"
import { updateCnpjAction, type UpdateCnpjState } from "./actions"

const initialState: UpdateCnpjState = {}

export function CompanyForm({ defaultCnpj }: { defaultCnpj: string | null }) {
  const [state, formAction, isPending] = useActionState(updateCnpjAction, initialState)
  const [cnpj, setCnpj] = useState(defaultCnpj ? formatCNPJ(defaultCnpj) : "")

  useEffect(() => {
    if (state.success) toast.success("CNPJ cadastrado com sucesso.")
    if (state.error) toast.error(state.error)
  }, [state])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Dados da empresa</h2>
        {defaultCnpj && <Badge>Conta empresa</Badge>}
      </div>
      <p className="text-muted-foreground text-sm">
        Cadastre o CNPJ da sua empresa para poder comprar documentos avulsos quando a cota
        gratuita mensal acabar, sem precisar assinar um plano.
      </p>
      <form action={formAction} className="max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            name="cnpj"
            value={cnpj}
            onChange={(event) => setCnpj(formatCNPJ(event.target.value))}
            placeholder="00.000.000/0000-00"
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          {defaultCnpj ? "Atualizar CNPJ" : "Cadastrar CNPJ"}
        </Button>
      </form>
    </div>
  )
}
