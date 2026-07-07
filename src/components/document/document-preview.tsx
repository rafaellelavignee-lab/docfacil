import { cn } from "@/lib/utils"
import type { ContentBlock } from "@/modules/templates/domain/content-schema"

const ALIGN_CLASS: Record<string, string> = {
  center: "text-center",
  right: "text-right",
  left: "text-left",
}

export function DocumentPreview({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border bg-white p-10 text-neutral-900 shadow-sm sm:p-14">
      <div className="space-y-4 font-serif text-[15px] leading-relaxed">
        {blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>
    </div>
  )
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "title":
      return (
        <h1 className="text-center text-lg font-bold tracking-wide uppercase">
          {block.text}
        </h1>
      )
    case "subtitle":
      return <h2 className="font-bold">{block.text}</h2>
    case "paragraph":
      return (
        <p className={cn("text-justify", block.align && ALIGN_CLASS[block.align])}>
          {block.text}
        </p>
      )
    case "fieldLine":
      return <p>{block.text}</p>
    case "list":
      return (
        <ul className="list-disc space-y-1 pl-6">
          {block.items?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )
    case "divider":
      return <hr className="border-neutral-300" />
    case "spacer":
      return <div className="h-4" aria-hidden />
    case "signature":
      return (
        <div className="mt-10 flex flex-col items-center text-center">
          <div className="w-64 border-t border-neutral-400 pt-1">
            <p>{block.text}</p>
            {block.signatureLabel && (
              <p className="text-xs text-neutral-500">{block.signatureLabel}</p>
            )}
          </div>
        </div>
      )
    default:
      return null
  }
}
