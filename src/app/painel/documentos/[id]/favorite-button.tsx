"use client"

import { useTransition } from "react"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toggleFavoriteAction } from "./actions"

export function FavoriteButton({ id, isFavorite }: { id: string; isFavorite: boolean }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => startTransition(() => toggleFavoriteAction(id))}
    >
      <Star className={cn("size-4", isFavorite && "fill-primary text-primary")} />
      {isFavorite ? "Favoritado" : "Favoritar"}
    </Button>
  )
}
