"use client"

import Link from "next/link"
import { useTransition } from "react"
import { Copy, Download, MoreVertical, Pencil, Star, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  deleteDocumentAction,
  duplicateDocumentAction,
  toggleFavoriteAction,
} from "@/app/painel/documentos/[id]/actions"

export interface DocumentCardData {
  id: string
  title: string
  templateName: string
  status: string
  isFavorite: boolean
  updatedAt: Date
}

export function DocumentCard({ document }: { document: DocumentCardData }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="group bg-card relative flex flex-col gap-3 rounded-xl border p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">{document.templateName}</p>
          <Link
            href={`/painel/documentos/${document.id}`}
            className="line-clamp-1 font-medium hover:underline"
          >
            {document.title}
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" className="shrink-0" />}
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              render={<a href={`/painel/documentos/${document.id}/download`} />}
            >
              <Download /> Baixar PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href={`/painel/documentos/${document.id}/editar`} />}
            >
              <Pencil /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => startTransition(() => toggleFavoriteAction(document.id))}
            >
              <Star className={cn(document.isFavorite && "fill-primary text-primary")} />
              {document.isFavorite ? "Remover dos favoritos" : "Favoritar"}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => startTransition(() => duplicateDocumentAction(document.id))}
            >
              <Copy /> Duplicar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={isPending}
              onClick={() => startTransition(() => deleteDocumentAction(document.id))}
            >
              <Trash2 /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant={document.status === "COMPLETED" ? "secondary" : "outline"}>
          {document.status === "COMPLETED" ? "Concluído" : "Rascunho"}
        </Badge>
        <span className="text-muted-foreground text-xs">
          {document.updatedAt.toLocaleDateString("pt-BR")}
        </span>
      </div>
    </div>
  )
}
