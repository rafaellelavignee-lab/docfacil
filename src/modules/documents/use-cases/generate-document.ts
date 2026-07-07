import { randomUUID } from "node:crypto"

import { resolveContentSchema } from "@/modules/documents/domain/resolve-tokens"
import type { UserDocumentRepository } from "@/modules/documents/ports/user-document-repository"
import type { StoragePort } from "@/modules/documents/ports/storage-port"
import type { ContentSchema } from "@/modules/templates/domain/content-schema"

export interface GenerateDocumentInput {
  userId: string
  templateId: string
  templateVersionId: string
  title: string
  contentSchema: ContentSchema
  formData: Record<string, string>
  watermark: boolean
}

export interface GenerateDocumentDeps {
  userDocumentRepository: UserDocumentRepository
  storage: StoragePort
  renderPdf: (input: {
    title: string
    blocks: ReturnType<typeof resolveContentSchema>
    watermark: boolean
  }) => Promise<Buffer>
}

export async function generateDocument(
  deps: GenerateDocumentDeps,
  input: GenerateDocumentInput
) {
  const blocks = resolveContentSchema(input.contentSchema, input.formData)
  const pdfBuffer = await deps.renderPdf({
    title: input.title,
    blocks,
    watermark: input.watermark,
  })

  const key = `${input.userId}/${randomUUID()}.pdf`
  const pdfBlobUrl = await deps.storage.upload(key, pdfBuffer, "application/pdf")

  return deps.userDocumentRepository.create({
    userId: input.userId,
    templateId: input.templateId,
    templateVersionId: input.templateVersionId,
    title: input.title,
    data: input.formData,
    pdfBlobUrl,
  })
}
