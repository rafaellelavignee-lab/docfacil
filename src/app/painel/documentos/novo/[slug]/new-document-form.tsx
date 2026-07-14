"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { DynamicForm } from "@/components/forms/dynamic-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { FieldSchema } from "@/modules/templates/domain/field-schema"
import { createDocumentAction, purchaseDocumentCreditAction } from "./actions"

export function NewDocumentForm({
  templateSlug,
  fields,
  documentPriceCents,
}: {
  templateSlug: string
  fields: FieldSchema[]
  documentPriceCents: number
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [canPurchase, setCanPurchase] = useState(false)

  async function handleSubmit(data: Record<string, string>) {
    setIsSubmitting(true)
    setCanPurchase(false)
    const result = await createDocumentAction(templateSlug, data)
    if (result?.error) {
      toast.error(result.error)
      setCanPurchase(Boolean(result.canPurchase))
      setIsSubmitting(false)
    }
  }

  async function handlePurchase() {
    setIsPurchasing(true)
    const result = await purchaseDocumentCreditAction()
    if (result?.error) {
      toast.error(result.error)
      setIsPurchasing(false)
    }
  }

  const price = (documentPriceCents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return (
    <div className="space-y-4">
      <DynamicForm
        fields={fields}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Gerar documento"
      />

      {canPurchase && (
        <Card>
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm">
              Sua cota gratuita deste mês acabou. Como conta empresa, você pode comprar
              este documento avulso, sem assinar um plano.
            </p>
            <Button onClick={handlePurchase} disabled={isPurchasing} className="w-full">
              {isPurchasing && <Loader2 className="size-4 animate-spin" />}
              Pagar {price} e liberar este documento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
