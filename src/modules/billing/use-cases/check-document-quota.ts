import type { Plan } from "@/generated/prisma/client"
import type { UserDocumentRepository } from "@/modules/documents/ports/user-document-repository"

export class DocumentQuotaExceededError extends Error {
  constructor(limit: number) {
    super(
      `Você atingiu o limite de ${limit} documentos este mês no plano gratuito. Faça upgrade para o Premium para gerar documentos ilimitados.`
    )
  }
}

export async function checkDocumentQuota(
  userDocumentRepository: UserDocumentRepository,
  plan: Plan,
  userId: string
): Promise<void> {
  if (plan.documentLimitPerMonth == null) return

  const count = await userDocumentRepository.countThisMonthByUser(userId)
  if (count >= plan.documentLimitPerMonth) {
    throw new DocumentQuotaExceededError(plan.documentLimitPerMonth)
  }
}
