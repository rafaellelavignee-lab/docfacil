import { renderToBuffer } from "@react-pdf/renderer"
import { DocumentPdf } from "@/infrastructure/pdf/document-pdf"
import type { ContentBlock } from "@/modules/templates/domain/content-schema"

export interface RenderDocumentPdfInput {
  title: string
  blocks: ContentBlock[]
  watermark?: boolean
  generatedAt?: Date
}

export async function renderDocumentPdf({
  title,
  blocks,
  watermark = false,
  generatedAt = new Date(),
}: RenderDocumentPdfInput): Promise<Buffer> {
  return renderToBuffer(
    <DocumentPdf
      title={title}
      blocks={blocks}
      watermark={watermark}
      generatedAt={generatedAt}
    />
  )
}
