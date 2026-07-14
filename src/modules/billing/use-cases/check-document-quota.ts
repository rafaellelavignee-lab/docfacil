import type { DocumentPurchase, Plan } from "@/generated/prisma/client"
import type { UserDocumentRepository } from "@/modules/documents/ports/user-document-repository"
import type { DocumentPurchaseRepository } from "@/modules/billing/ports/document-purchase-repository"

export class DocumentQuotaExceededError extends Error {
  canPurchase: boolean

  constructor(limit: number, canPurchase: boolean) {
    super(
      canPurchase
        ? `Você atingiu o limite de ${limit} documentos este mês no plano gratuito. Compre um documento avulso ou faça upgrade para o Premium.`
        : `Você atingiu o limite de ${limit} documentos este mês no plano gratuito. Faça upgrade para o Premium para gerar documentos ilimitados.`
    )
    this.canPurchase = canPurchase
  }
}

export interface CheckDocumentQuotaDeps {
  userDocumentRepository: UserDocumentRepository
  documentPurchaseRepository: DocumentPurchaseRepository
}

/**
 * Retorna um crédito avulso a ser consumido quando a cota mensal estourou
 * mas o usuário (conta empresa) já tem um documento pago disponível.
 * Retorna null quando a cota mensal ainda cobre a geração.
 */
export async function checkDocumentQuota(
  deps: CheckDocumentQuotaDeps,
  plan: Plan,
  userId: string,
  userCnpj: string | null
): Promise<DocumentPurchase | null> {
  if (plan.documentLimitPerMonth == null) return null

  const count = await deps.userDocumentRepository.countThisMonthByUser(userId)
  if (count < plan.documentLimitPerMonth) return null

  const credit = await deps.documentPurchaseRepository.findAvailableCreditByUser(userId)
  if (credit) return credit

  throw new DocumentQuotaExceededError(plan.documentLimitPerMonth, userCnpj != null)
}
