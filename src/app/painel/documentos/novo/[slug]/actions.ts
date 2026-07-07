"use server"

import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { getUserActivePlan } from "@/modules/billing/queries/get-user-plan"
import {
  checkDocumentQuota,
  DocumentQuotaExceededError,
} from "@/modules/billing/use-cases/check-document-quota"
import { generateDocument } from "@/modules/documents/use-cases/generate-document"
import { getPublishedTemplateBySlug } from "@/modules/templates/queries/get-template-by-slug"
import type { ContentSchema } from "@/modules/templates/domain/content-schema"

export interface CreateDocumentResult {
  error?: string
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

  const plan = await getUserActivePlan(session.user.id)

  try {
    await checkDocumentQuota(container.userDocumentRepository, plan, session.user.id)
  } catch (error) {
    if (error instanceof DocumentQuotaExceededError) {
      return { error: error.message }
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

  redirect(`/painel/documentos/${userDocument.id}`)
}
