import type {
  ContentBlock,
  ContentSchema,
} from "@/modules/templates/domain/content-schema"

const TOKEN_PATTERN = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g

/**
 * Substitui tokens `{{chave}}` pelos valores preenchidos. Os valores são
 * inseridos como texto puro (nunca via HTML), tanto no preview em tela
 * quanto no PDF — não há como um valor de usuário injetar marcação.
 */
export function resolveTokens(
  text: string,
  data: Record<string, string | undefined>
): string {
  return text.replace(TOKEN_PATTERN, (_match, key: string) => {
    const value = data[key]
    return value !== undefined && value !== "" ? value : `[${key}]`
  })
}

export function resolveContentSchema(
  schema: ContentSchema,
  data: Record<string, string | undefined>
): ContentBlock[] {
  return schema.blocks.map((block) => ({
    ...block,
    text: block.text ? resolveTokens(block.text, data) : block.text,
    items: block.items?.map((item) => resolveTokens(item, data)),
    signatureLabel: block.signatureLabel
      ? resolveTokens(block.signatureLabel, data)
      : block.signatureLabel,
  }))
}
