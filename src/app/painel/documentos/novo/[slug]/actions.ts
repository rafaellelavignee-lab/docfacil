"use server"

import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { getUserActivePlan } from "@/modules/billing/queries/get-user-plan"
import {
  checkDocumentQuota,
  DocumentQuotaExceededError,
} from "@/modules/billing/use-cases/check-document-quota"
import {
  purchaseDocumentCredit,
  CompanyAccountRequiredError,
} from "@/modules/billing/use-cases/purchase-document-credit"
import { generateDocument } from "@/modules/documents/use-cases/generate-document"
import { getPublishedTemplateBySlug } from "@/modules/templates/queries/get-template-by-slug"
import type { ContentSchema } from "@/modules/templates/domain/content-schema"

export interface CreateDocumentResult {
  error?: string
  canPurchase?: boolean
}

export async function createDocumentAction(
  templateSlug: string,
  formData: Record<string, string>
): Promise<CreateDocumentResult> {
  const session = await auth()
  if (!session?.user) {
    return { error: "Sessão expirada. Faça login novamente." }
  }

  const template = await getPublishedTemplateBySlug(templateSlug)
  if (!template?.activeVersion) {
    return { error: "Documento não encontrado." }
  }

  const [plan, user] = await Promise.all([
    getUserActivePlan(session.user.id),
    container.userRepository.findById(session.user.id),
  ])
  if (!user) {
    return { error: "Sessão expirada. Faça login novamente." }
  }

  let creditToConsume: Awaited<ReturnType<typeof checkDocumentQuota>> = null
  try {
    creditToConsume = await checkDocumentQuota(
      {
        userDocumentRepository: container.userDocumentRepository,
        documentPurchaseRepository: container.documentPurchaseRepository,
      },
      plan,
      session.user.id,
      user.cnpj
    )
  } catch (error) {
    if (error instanceof DocumentQuotaExceededError) {
      return { error: error.message, canPurchase: error.canPurchase }
    }
    throw error
  }

  const userDocument = await generateDocument(
    {
      userDocumentRepository: container.userDocumentRepository,
      storage: container.storage,
      renderPdf: container.renderPdf,
    },
    {
      userId: session.user.id,
      templateId: template.id,
      templateVersionId: template.activeVersion.id,
      title: template.name,
      contentSchema: template.activeVersion.contentSchema as unknown as ContentSchema,
      formData,
      watermark: plan.watermark,
    }
  )

  if (creditToConsume) {
    await container.documentPurchaseRepository.markConsumed(
      creditToConsume.id,
      userDocument.id
    )
  }

  redirect(`/painel/documentos/${userDocument.id}`)
}

export interface PurchaseDocumentCreditResult {
  error?: string
}

export async function purchaseDocumentCreditAction(): Promise<PurchaseDocumentCreditResult> {
  const session = await auth()
  if (!session?.user) return { error: "Sessão expirada. Faça login novamente." }

  const user = await container.userRepository.findById(session.user.id)
  if (!user) return { error: "Sessão expirada. Faça login novamente." }

  let initPoint: string
  try {
    const result = await purchaseDocumentCredit(
      {
        documentPurchaseRepository: container.documentPurchaseRepository,
        paymentGateway: container.paymentGateway,
      },
      { userId: user.id, userEmail: user.email, userCnpj: user.cnpj }
    )
    initPoint = result.initPoint
  } catch (error) {
    if (error instanceof CompanyAccountRequiredError) {
      return { error: error.message }
    }
    throw error
  }

  redirect(initPoint)
}
