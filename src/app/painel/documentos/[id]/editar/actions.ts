"use server"

import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { container } from "@/lib/container"
import { getUserActivePlan } from "@/modules/billing/queries/get-user-plan"
import { regenerateDocument } from "@/modules/documents/use-cases/regenerate-document"
import type { ContentSchema } from "@/modules/templates/domain/content-schema"

export interface UpdateDocumentResult {
  error?: string
}

export async function updateDocumentAction(
  documentId: string,
  formData: Record<string, string>
): Promise<UpdateDocumentResult> {
  const session = await auth()
  if (!session?.user) {
    return { error: "Sessão expirada. Faça login novamente." }
  }

  const document = await container.userDocumentRepository.findById(documentId)
  if (!document || document.userId !== session.user.id) {
    return { error: "Documento não encontrado." }
  }

  const plan = await getUserActivePlan(session.user.id)

  await regenerateDocument(
    {
      userDocumentRepository: container.userDocumentRepository,
      storage: container.storage,
      renderPdf: container.renderPdf,
    },
    {
      userDocumentId: documentId,
      userId: session.user.id,
      title: document.title,
      contentSchema: document.templateVersion.contentSchema as unknown as ContentSchema,
      formData,
      watermark: plan.watermark,
    }
  )

  redirect(`/painel/documentos/${documentId}`)
}
