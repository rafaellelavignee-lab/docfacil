import { randomUUID } from "node:crypto"

import { resolveContentSchema } from "@/modules/documents/domain/resolve-tokens"
import type { UserDocumentRepository } from "@/modules/documents/ports/user-document-repository"
import type { StoragePort } from "@/modules/documents/ports/storage-port"
import type { ContentSchema } from "@/modules/templates/domain/content-schema"

export interface RegenerateDocumentInput {
  userDocumentId: string
  userId: string
  title: string
  contentSchema: ContentSchema
  formData: Record<string, string>
  watermark: boolean
}

export interface RegenerateDocumentDeps {
  userDocumentRepository: UserDocumentRepository
  storage: StoragePort
  renderPdf: (input: {
    title: string
    blocks: ReturnType<typeof resolveContentSchema>
    watermark: boolean
  }) => Promise<Buffer>
}

/** Reedita um documento já gerado: atualiza os dados preenchidos e
 * regenera o PDF a partir da mesma versão de template originalmente usada. */
export async function regenerateDocument(
  deps: RegenerateDocumentDeps,
  input: RegenerateDocumentInput
) {
  const blocks = resolveContentSchema(input.contentSchema, input.formData)
  const pdfBuffer = await deps.renderPdf({
    title: input.title,
    blocks,
    watermark: input.watermark,
  })

  const key = `${input.userId}/${randomUUID()}.pdf`
  const pdfBlobUrl = await deps.storage.upload(key, pdfBuffer, "application/pdf")

  return deps.userDocumentRepository.update(input.userDocumentId, {
    data: input.formData,
    pdfBlobUrl,
    title: input.title,
  })
}
