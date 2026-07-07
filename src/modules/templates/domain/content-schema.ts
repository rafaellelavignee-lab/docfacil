export type ContentBlockType =
  | "title"
  | "subtitle"
  | "paragraph"
  | "fieldLine"
  | "list"
  | "signature"
  | "divider"
  | "spacer"

export type ContentAlign = "left" | "center" | "right"

/**
 * Bloco de conteúdo do corpo do documento. Textos contêm tokens `{{chave}}`
 * substituídos pelos valores preenchidos no formulário. O mesmo array de
 * blocos alimenta tanto o preview em HTML (tela) quanto o PDF
 * (@react-pdf/renderer) — um único schema, dois renderizadores.
 */
export interface ContentBlock {
  type: ContentBlockType
  text?: string
  items?: string[]
  align?: ContentAlign
  signatureLabel?: string
}

export interface ContentSchema {
  blocks: ContentBlock[]
}
